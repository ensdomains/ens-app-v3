/* eslint-disable no-multi-assign */
import { sha256 } from '@noble/hashes/sha256'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { bytesToHex } from 'viem'
import { useAccount, useSignTypedData } from 'wagmi'

import { Button, Dialog, Helper } from '@ensdomains/thorin'

import { useChainName } from '@app/hooks/chain/useChainName'
import { createMetaDataUrl, META_DATA_QUERY_KEY } from '@app/hooks/useEnsAvatar'
import { headerAspectRatio } from '@app/utils/headerUpload'

import { AvCancelButton, CropComponent } from './HeaderCrop'

const CroppedImagePreview = styled.img(
  ({ theme }) => css`
    aspect-ratio: ${headerAspectRatio};
    width: ${theme.space.full};
    max-width: ${theme.space['96']};
    border-radius: ${theme.radii.extraLarge};
  `,
)

const dataURLToBytes = (dataURL: string) => {
  const base64 = dataURL.split(',')[1]
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
  return bytes
}

type AvatarUploadResult =
  | {
      message: string
    }
  | {
      error: string
      status: number
    }

const UploadComponent = ({
  dataURL,
  handleCancel,
  handleSubmit,
  name,
}: {
  dataURL: string
  handleCancel: () => void
  handleSubmit: (type: 'upload', uri: string, display?: string) => void
  name: string
}) => {
  const { t } = useTranslation('transactionFlow')
  const queryClient = useQueryClient()
  const chainName = useChainName()

  const { address } = useAccount()
  const { signTypedDataAsync } = useSignTypedData()

  const {
    mutate: signAndUpload,
    isPending,
    error,
  } = useMutation<void, Error>({
    mutationFn: async () => {
      const baseURL = process.env.NEXT_PUBLIC_AVUP_ENDPOINT || `https://euc.li`
      let endpoint

      if (chainName !== 'mainnet') {
        // For testnets, use the format /:testnet/:name/h
        endpoint = `${baseURL}/${chainName}/${name}/h`
      } else {
        // For mainnet, use the format /:name/header
        endpoint = `${baseURL}/${name}/h`
      }

      const urlHash = bytesToHex(sha256(dataURLToBytes(dataURL)))
      const expiry = `${Date.now() + 1000 * 60 * 60 * 24 * 7}`

      const sig = await signTypedDataAsync({
        primaryType: 'Upload',
        domain: {
          name: 'Ethereum Name Service',
          version: '1',
        },
        types: {
          Upload: [
            { name: 'upload', type: 'string' },
            { name: 'expiry', type: 'string' },
            { name: 'name', type: 'string' },
            { name: 'hash', type: 'string' },
          ],
        },
        message: {
          upload: 'header',
          expiry,
          name,
          hash: urlHash,
        },
      })

      // Add timeout to fetch request
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      try {
        const response = await fetch(endpoint, {
          method: 'PUT',
          signal: controller.signal,
          headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            expiry,
            dataURL,
            sig,
            unverifiedAddress: address,
          }),
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`Upload failed with status ${response.status}`)
        }

        const fetched = (await response.json()) as AvatarUploadResult

        if ('message' in fetched && fetched.message === 'uploaded') {
          queryClient.invalidateQueries({
            queryKey: [META_DATA_QUERY_KEY, createMetaDataUrl({ name, chainName, mediaKey: 'header' })],
          })
          return handleSubmit('upload', endpoint, dataURL)
        }

        if ('error' in fetched) {
          throw new Error(fetched.error)
        }

        throw new Error('Unknown error')
      } catch (err) {
        clearTimeout(timeoutId)
        if (err instanceof Error && err.name === 'AbortError') {
          throw new Error('Upload timed out. Please try again.')
        }
        throw err
      }
    },
  })

  return (
    <>
      <Dialog.Heading
        title={t('input.profileEditor.tabs.header.image.upload.title')}
        subtitle={t('input.profileEditor.tabs.header.image.upload.subtitle')}
      />
      <Dialog.Content>
        <CroppedImagePreview data-testid="cropped-image-preview" src={dataURL} />
      </Dialog.Content>
      {error && (
        <Helper data-testid="avatar-upload-error" alert="error">
          {error.message}
        </Helper>
      )}
      <Dialog.Footer
        leading={<AvCancelButton handleCancel={handleCancel} />}
        trailing={
          <Button
            disabled={isPending}
            colorStyle={error ? 'redSecondary' : undefined}
            onClick={() => signAndUpload()}
            data-testid="upload-button"
          >
            {error
              ? t('action.tryAgain', { ns: 'common' })
              : t('input.profileEditor.tabs.header.image.upload.action')}
          </Button>
        }
      />
    </>
  )
}

export const HeaderUpload = ({
  headerFile,
  handleCancel,
  handleSubmit,
  name,
}: {
  headerFile: File
  handleCancel: () => void
  handleSubmit: (type: 'upload', uri: string, display?: string) => void
  name: string
}) => {
  const [dataURL, setDataURL] = useState<string | null>(null)

  if (!dataURL) {
    return <CropComponent {...{ avatar: headerFile, setDataURL, handleCancel }} />
  }

  return (
    <UploadComponent {...{ dataURL, handleCancel: () => setDataURL(null), name, handleSubmit }} />
  )
}
