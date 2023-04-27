import { hexStripZeros } from '@ethersproject/bytes'
import { ENSArgs } from '../index'
import { hexDecodeName } from '../utils/hexEncodedName'
import {
  checkIsDecrypted,
  decodeLabelhash,
  getEncryptedLabelAmount,
  isEncodedLabelhash,
} from '../utils/labels'
import { namehash } from '../utils/normalise'

const raw = async (
  { contracts }: ENSArgs<'contracts'>,
  name: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  allowIncomplete?: boolean,
) => {
  const nameWrapper = await contracts?.getNameWrapper()!

  return {
    to: nameWrapper.address,
    data: nameWrapper.interface.encodeFunctionData('names', [namehash(name)]),
  }
}

const generateNameQuery = (labels: string[]) => {
  let query = ''

  for (let i = 0; i < labels.length; i += 1) {
    const label = labels[i]
    if (isEncodedLabelhash(label)) {
      query += `
        label${i}: domains(where: { labelhash: "${decodeLabelhash(
        label,
      ).toLowerCase()}", labelName_not: null }) {
          labelName
        }
      `
    }
  }

  return query
}

const decode = async (
  { contracts, gqlInstance }: ENSArgs<'contracts' | 'gqlInstance'>,
  data: string,
  name: string,
  allowIncomplete: boolean = false,
) => {
  if (data !== null) {
    const nameWrapper = await contracts?.getNameWrapper()!
    try {
      const result = nameWrapper.interface.decodeFunctionResult('names', data)
      if (hexStripZeros(result['0']) !== '0x') {
        const decoded = hexDecodeName(result['0'])
        if (decoded && decoded !== '.') return decoded
      }
    } catch (e: any) {
      console.error('Error decoding name: ', e)
      return
    }
  }

  if (checkIsDecrypted(name)) return name
  // if the name isn't wrapped, try to fetch the name from an existing Domain entity
  // also try to fetch the label names from any Domain entities that have a corresponding labelhash
  const labels = name.split('.')
  const decryptedNameQuery = gqlInstance.gql`
        query decodedName($id: String!) {
          namehashLookup: domains(where: { id: $id }) {
            name
          }
          ${generateNameQuery(labels)}
        }
      `

  const decryptedNameResult = await gqlInstance.client.request(
    decryptedNameQuery,
    {
      id: namehash(name),
    },
  )

  if (!decryptedNameResult) return

  const namehashLookupResult = decryptedNameResult?.namehashLookup[0]?.name
  let bestResult: string | undefined = namehashLookupResult
  if (namehashLookupResult && checkIsDecrypted(namehashLookupResult)) {
    return namehashLookupResult
  }

  const { namehashLookup: _, ...labelNames } = decryptedNameResult
  if (Object.keys(labelNames).length !== 0) {
    for (const [key, value] of Object.entries<[{ labelName?: string }]>(
      labelNames,
    )) {
      if (value.length && value[0].labelName) {
        labels[parseInt(key.replace('label', ''))] = value[0].labelName
      }
    }
    const labelLookupResult = labels.join('.')
    if (
      !namehashLookupResult ||
      getEncryptedLabelAmount(namehashLookupResult) >
        getEncryptedLabelAmount(labelLookupResult)
    )
      bestResult = labelLookupResult
  }

  if (!bestResult || (!allowIncomplete && !checkIsDecrypted(bestResult))) return

  return bestResult
}

export default {
  raw,
  decode,
}
