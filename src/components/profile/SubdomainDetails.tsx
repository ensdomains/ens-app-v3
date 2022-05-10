import { imageUrlUnknownRecord } from '@app/utils/utils'
import { ArrowRightSVG, Avatar, Typography } from '@ensdomains/thorin'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

type Subdomain = {
  name: string
  truncatedName?: string
}

const SubdomainWrapper = styled.div`
  ${({ theme }) => `
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${theme.space['3']} ${theme.space['4.5']};
  border-bottom: 1px solid ${theme.colors.borderTertiary};
  transition: all 0.15s ease-in-out;

  &:hover {
    background-color: ${theme.colors.backgroundSecondary};
  }

  &:last-of-type {
    border: none;
  }
  `}
`

const EmptyDetailContainer = styled.div`
  padding: ${({ theme }) => theme.space['4']};
  display: flex;
  justify-content: center;
  align-items: center;
`

const Stack = styled.div`
  ${({ theme }) => `
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${theme.space['4']};
  flex-gap: ${theme.space['4']};
  `}
`

const RightArrow = styled.svg`
  ${({ theme }) => `
  stroke-width: ${theme.borderWidths['0.75']};
  color: ${theme.colors.textTertiary};
  display: block;
  height: ${theme.space['6']};
  width: ${theme.space['6']};
  `}
`

const SubdomainItem = ({
  name,
  network,
  truncatedName,
}: Subdomain & {
  network: string
}) => {
  const [src, setSrc] = useState('')

  useEffect(() => {
    const run = async () => {
      const response = await fetch(imageUrlUnknownRecord(name, network))
      const imgBlob = response && (await response.blob())
      const _src = URL.createObjectURL(imgBlob)
      if (imgBlob?.type.startsWith('image/')) {
        setSrc(_src)
      }
    }

    run()
  }, [name, network])

  return (
    <Link href={`/profile/${name}`} passHref>
      <SubdomainWrapper as="a">
        <Stack>
          <Avatar label={name} src={src} placeholder={src === ''} size="9" />
          <Typography color="text" weight="bold" variant="extraLarge">
            {truncatedName || name}
          </Typography>
        </Stack>
        <RightArrow as={ArrowRightSVG} />
      </SubdomainWrapper>
    </Link>
  )
}

export const SubdomainDetails = ({
  subdomains,
  network,
  loading,
}: {
  subdomains: Subdomain[]
  network: string
  loading: boolean
}) => {
  const { t } = useTranslation('profile')

  return (
    <>
      {!loading && subdomains.length > 0 ? (
        subdomains.map((subdomain) => (
          <SubdomainItem
            key={subdomain.name}
            network={network}
            {...subdomain}
          />
        ))
      ) : (
        <EmptyDetailContainer>
          {loading ? t('tabs.subdomains.loading') : t('tabs.subdomains.empty')}
        </EmptyDetailContainer>
      )}
    </>
  )
}
