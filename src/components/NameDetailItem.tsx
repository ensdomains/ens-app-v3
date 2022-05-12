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
    width: 100%;
    padding: ${theme.space['3']} ${theme.space['4.5']};
    border-bottom: 1px solid ${theme.colors.borderTertiary};
    transition: all 0.15s ease-in-out;
    &:hover {
      background-color: ${theme.colors.backgroundTertiary};
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

type Name = {
  name: string
  truncatedName: string
}

export const DomainDetailItem = ({
  name,
  truncatedName,
  network,
  children,
}: Name & {
  network: string
  children: ReactNode
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
      <NameItemWrapper as="a">
        <NameItemContainer>
          <Avatar
            label={truncatedName}
            src={src}
            placeholder={src === ''}
            size="9"
          />
          <Typography color="text" weight="bold" variant="extraLarge">
            {truncatedName}
          </Typography>
        </NameItemContainer>
        {children}
      </NameItemWrapper>
    </Link>
  )
}
