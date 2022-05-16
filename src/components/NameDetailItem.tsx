import { useZorb } from '@app/hooks/useZorb'
import { imageUrlUnknownRecord } from '@app/utils/utils'
import { Avatar, Typography } from '@ensdomains/thorin'
import Link from 'next/link'
import { ReactNode, useEffect, useState } from 'react'
import styled from 'styled-components'

const NameItemWrapper = styled.div`
  ${({ theme }) => `
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
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

const NameItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-gap: 16px;
`

const AvatarWrapper = styled.div`
  ${({ theme }) => `
    width: ${theme.space['9']};
  `}
`

type Name = {
  id: string
  name: string
  truncatedName?: string
}

export const NameDetailItem = ({
  id,
  name,
  truncatedName,
  network,
  children,
}: Name & {
  network: string
  children: ReactNode
}) => {
  const [src, setSrc] = useState('')
  const zorb = useZorb(id, 'hash')

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
      <NameItemWrapper as="a">
        <NameItemContainer>
          <AvatarWrapper>
            <Avatar label={truncatedName || name} src={src || zorb} />
          </AvatarWrapper>
          <Typography color="text" weight="bold" variant="extraLarge">
            {truncatedName}
          </Typography>
        </NameItemContainer>
        {children}
      </NameItemWrapper>
    </Link>
  )
}
