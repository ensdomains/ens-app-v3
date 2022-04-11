import { imageUrlUnknownRecord } from '@app/utils/utils'
import { ArrowRightSVG, Avatar, tokens, Typography } from '@ensdomains/thorin'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

type Subdomain = {
  name: string
}

// should be borderTertiary
const SubdomainWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${tokens.space['3']} ${tokens.space['4.5']};
  border-bottom: 1px solid
    ${({ theme }) => tokens.colors[theme.mode].borderSecondary};
  transition: all 0.15s ease-in-out;

  &:hover {
    background-color: ${({ theme }) =>
      tokens.colors[theme.mode].backgroundTertiary};
  }

  &:last-of-type {
    border: none;
  }
`

const EmptyDetailContainer = styled.div`
  padding: ${tokens.space['4']};
  display: flex;
  justify-content: center;
  align-items: center;
`

const Stack = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-gap: ${tokens.space['4']};
`

const SubdomainItem = ({
  name,
  network,
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
            {name}
          </Typography>
        </Stack>
        <ArrowRightSVG strokeWidth="0.75" color="textTertiary" />
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
          <SubdomainItem network={network} {...subdomain} />
        ))
      ) : (
        <EmptyDetailContainer>
          {loading ? t('tabs.subdomains.loading') : t('tabs.subdomains.empty')}
        </EmptyDetailContainer>
      )}
    </>
  )
}
