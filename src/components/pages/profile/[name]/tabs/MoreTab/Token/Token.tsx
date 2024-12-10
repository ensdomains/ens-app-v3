import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { labelhash, namehash } from 'viem'

import { Tag, Typography } from '@ensdomains/thorin'

import { CacheableComponent } from '@app/components/@atoms/CacheableComponent'
import { NFTWithPlaceholder } from '@app/components/NFTWithPlaceholder'
import { Outlink } from '@app/components/Outlink'
import RecordItem from '@app/components/RecordItem'
import { useChainName } from '@app/hooks/chain/useChainName'
import { useContractAddress } from '@app/hooks/chain/useContractAddress'
import { checkETH2LDFromName, makeEtherscanLink } from '@app/utils/utils'

import { TabWrapper } from '../../../../TabWrapper'

type Props = {
  name: string
  isWrapped: boolean
}

const Container = styled(TabWrapper)(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;

    & > div {
      padding: ${theme.space['4']};
      border-bottom: 1px solid ${theme.colors.border};
    }

    & > div:last-of-type {
      border-bottom: none;
    }

    @media (min-width: ${theme.breakpoints.sm}px) {
      & > div {
        padding: ${theme.space['4']} ${theme.space['6']};
      }

      & > div:first-of-type {
        padding: ${theme.space['6']};
      }
    }
  `,
)

const HeaderContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    & > div:first-of-type {
      font-size: ${theme.fontSizes.headingFour};
      font-weight: ${theme.fontWeights.bold};
    }
  `,
)

const IdsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    gap: ${theme.space['4']};
    @media (min-width: ${theme.breakpoints.sm}px) {
      gap: ${theme.space['2']};
    }
  `,
)

const ItemsContainer = styled(CacheableComponent)(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['4']};

    overflow: hidden;

    @media (min-width: ${theme.breakpoints.sm}px) {
      flex-direction: row;
    }
  `,
)

const NftBox = styled(NFTWithPlaceholder)(
  ({ theme }) => css`
    max-width: 100%;
    aspect-ratio: 1;

    @media (min-width: ${theme.breakpoints.sm}px) {
      max-width: ${theme.space['36']};
      max-height: ${theme.space['36']};
    }
  `,
)

const Token = ({ name, isWrapped }: Props) => {
  const { t } = useTranslation('profile')

  const networkName = useChainName()
  const nameWrapperAddress = useContractAddress({ contract: 'ensNameWrapper' })
  const registrarAddress = useContractAddress({ contract: 'ensBaseRegistrarImplementation' })

  const is2ldEth = checkETH2LDFromName(name)

  const hex = isWrapped ? namehash(name) : labelhash(name.split('.')[0])
  const tokenId = BigInt(hex).toString(10)

  const contractAddress = isWrapped ? nameWrapperAddress : registrarAddress

  const hasToken = is2ldEth || isWrapped

  return (
    <Container>
      <HeaderContainer>
        <Typography fontVariant="headingFour">{t('tabs.more.token.label')}</Typography>
        {hasToken ? (
          <Outlink
            data-testid="etherscan-nft-link"
            href={makeEtherscanLink(`${contractAddress}/${tokenId}`, networkName, 'nft')}
          >
            {t('etherscan', { ns: 'common' })}
          </Outlink>
        ) : (
          <Tag colorStyle="greySecondary">{t('tabs.more.token.noToken')}</Tag>
        )}
      </HeaderContainer>
      {hasToken && (
        <ItemsContainer data-testid="token-ids">
          <IdsContainer>
            <RecordItem itemKey={t('tabs.more.token.hex')} value={hex} type="text" />
            <RecordItem itemKey={t('tabs.more.token.decimal')} value={tokenId} type="text" />
          </IdsContainer>
          <NftBox id="nft" name={name} />
        </ItemsContainer>
      )}
    </Container>
  )
}

export default Token
