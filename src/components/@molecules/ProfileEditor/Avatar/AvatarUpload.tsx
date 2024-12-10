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

import { AvCancelButton, CropComponent } from './AvatarCrop'

const CroppedImagePreview = styled.img(
  ({ theme }) => css`
    aspect-ratio: 1;
    width: ${theme.space.full};
    max-width: ${theme.space['72']};
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
      let baseURL = process.env.NEXT_PUBLIC_AVUP_ENDPOINT || `https://euc.li`
      if (chainName !== 'mainnet') {
        baseURL = `${baseURL}/${chainName}`
      }
      const endpoint = `${baseURL}/${name}`

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
          upload: 'avatar',
          expiry,
          name,
          hash: urlHash,
        },
      })
      const fetched = (await fetch(endpoint, {
        method: 'PUT',
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
      }).then((res) => res.json())) as AvatarUploadResult

      if ('message' in fetched && fetched.message === 'uploaded') {
        queryClient.invalidateQueries({
          predicate: (query) => {
            const {
              queryKey: [params],
            } = query
            if (params !== 'ensAvatar') return false
            return true
          },
        })
        return handleSubmit('upload', endpoint, dataURL)
      }

      if ('error' in fetched) {
        throw new Error(fetched.error)
      }

      throw new Error('Unknown error')
    },
  })

  return (
    <>
      <Dialog.Heading
        title={t('input.profileEditor.tabs.avatar.image.upload.title')}
        subtitle={t('input.profileEditor.tabs.avatar.image.upload.subtitle')}
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
              : t('input.profileEditor.tabs.avatar.image.upload.action')}
          </Button>
        }
      />
    </>
  )
}

export const AvatarUpload = ({
  avatar,
  handleCancel,
  handleSubmit,
  name,
}: {
  avatar: File
  handleCancel: () => void
  handleSubmit: (type: 'upload', uri: string, display?: string) => void
  name: string
}) => {
  const [dataURL, setDataURL] = useState<string | null>(null)

  if (!dataURL) {
    return <CropComponent {...{ avatar, setDataURL, handleCancel }} />
  }

  return (
    <UploadComponent {...{ dataURL, handleCancel: () => setDataURL(null), name, handleSubmit }} />
  )
}
