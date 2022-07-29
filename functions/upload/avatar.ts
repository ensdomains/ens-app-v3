import { AwsClient } from 'aws4fetch'
import { sha256, verifyTypedData } from 'ethers/lib/utils'

type Env = {
  FILEBASE_ACCESS_KEY: string
  FILEBASE_SECRET: string
}

type AvatarUploadParams = {
  name: string
  expiry: string
  url: string

  sig: string
}

const dataURLToBytes = (dataURL: string) => {
  const base64 = dataURL.split(',')[1]
  const mime = dataURL.split(',')[0].split(':')[1].split(';')[0]
  const bytes = new TextEncoder().encode(base64)
  return { mime, bytes }
}

const bucket = 'avatars-test'
const endpoint = `https://${bucket}.s3.filebase.com/`

const upload = async (buffer: Uint8Array, name: string, env: Env) => {
  const ipfs = new AwsClient({
    accessKeyId: env.FILEBASE_ACCESS_KEY,
    secretAccessKey: env.FILEBASE_SECRET,
    region: 'us-east-1',
    service: 's3',
  })

  const item = await ipfs.fetch(`${endpoint + name}-temp.jpeg`, {
    method: 'PUT',
    body: buffer,
  })

  if (item.status !== 200) return null

  return item.headers.get('x-amz-meta-cid')
}

export const onRequestPost: PagesFunction<Env, any, any> = async ({
  request,
  env,
}) => {
  console.log('\n\n\nGOT REQUEST\n\n\n')

  const { name, expiry, url, sig } =
    (await request.json()) as AvatarUploadParams
  const { mime, bytes } = dataURLToBytes(url)
  const hash = sha256(bytes)

  const verifiedAddress = verifyTypedData(
    {
      name: 'Ethereum Name Service',
      version: '1',
    },
    {
      Upload: [
        { name: 'upload', type: 'string' },
        { name: 'expiry', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'hash', type: 'string' },
      ],
    },
    {
      upload: 'avatar',
      expiry,
      name,
      hash,
    },
    sig,
  )

  if (verifiedAddress !== '0x70997970C51812dc3A010C7d01b50e0d17dc79C8') {
    return new Response(
      JSON.stringify({
        error: 'Signature does not match name controller or owner',
      }),
      {
        status: 401,
      },
    )
  }

  if (mime !== 'image/jpeg') {
    return new Response(
      JSON.stringify({
        error: 'Only jpeg images are supported',
      }),
      {
        status: 400,
      },
    )
  }

  const cid = await upload(bytes, name, env)

  if (!cid) {
    return new Response(
      JSON.stringify({
        error: 'Request failed',
      }),
      {
        status: 500,
      },
    )
  }

  return new Response(
    JSON.stringify({
      cid,
    }),
    {
      status: 200,
    },
  )
}
