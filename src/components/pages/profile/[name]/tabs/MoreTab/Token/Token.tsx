import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { labelhash, namehash } from 'viem'

import { GetOwnerReturnType, GetWrapperDataReturnType } from '@ensdomains/ensjs/public'
import { mq, Tag, Typography } from '@ensdomains/thorin2'

import { CacheableComponent } from '@app/components/@atoms/CacheableComponent'
import { NFTWithPlaceholder } from '@app/components/NFTWithPlaceholder'
import { Outlink } from '@app/components/Outlink'
import RecordItem from '@app/components/RecordItem'
import { useChainName } from '@app/hooks/chain/useChainName'
import { useContractAddress } from '@app/hooks/chain/useContractAddress'
import { useFusesStates } from '@app/hooks/fuses/useFusesStates'
import { useParentBasicName } from '@app/hooks/useParentBasicName'
import { Profile } from '@app/types'
import { checkETH2LDFromName, makeEtherscanLink } from '@app/utils/utils'

import { TabWrapper } from '../../../../TabWrapper'
import UnwrapButton from './UnwrapButton'
import WrapButton from './WrapButton'

type Props = {
  name: string
  isWrapped: boolean
  canBeWrapped: boolean
  wrapperData: GetWrapperDataReturnType | undefined
  ownerData: GetOwnerReturnType | undefined
  profile: Profile | undefined
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

    ${mq.sm.min(css`
      & > div {
        padding: ${theme.space['4']} ${theme.space['6']};
      }

      & > div:first-of-type {
        padding: ${theme.space['6']};
      }
    `)}
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

    ${mq.sm.min(css`
      gap: ${theme.space['2']};
    `)}
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

    ${mq.sm.min(css`
      flex-direction: row;
    `)}
  `,
)

const NftBox = styled(NFTWithPlaceholder)(
  ({ theme }) => css`
    max-width: 100%;
    aspect-ratio: 1;

    ${mq.sm.min(css`
      max-width: ${theme.space['36']};
      max-height: ${theme.space['36']};
    `)}
  `,
)

const Token = ({ name, isWrapped, canBeWrapped, wrapperData, ownerData, profile }: Props) => {
  const { t } = useTranslation('profile')

  const networkName = useChainName()

  const { wrapperData: parentWrapperData, isCachedData: isParentBasicCachedData } =
    useParentBasicName(name)
  const fusesStatus = useFusesStates({
    wrapperData,
    parentWrapperData,
  })
  const status = isWrapped ? fusesStatus.state : 'unwrapped'
  const is2ldEth = checkETH2LDFromName(name)

  const hex = isWrapped ? namehash(name) : labelhash(name.split('.')[0])
  const tokenId = BigInt(hex).toString(10)

  const wrapperAddress = useContractAddress({ contract: 'ensNameWrapper' })
  const registrarAddress = useContractAddress({ contract: 'ensBaseRegistrarImplementation' })

  const contractAddress = isWrapped ? wrapperAddress : registrarAddress

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
      <ItemsContainer $isCached={isParentBasicCachedData}>
        <RecordItem
          itemKey={t('tabs.more.token.wrapper')}
          value={t(`tabs.more.token.status.${status}`)}
          type="text"
        />
        {isWrapped ? (
          <UnwrapButton name={name} ownerData={ownerData} status={status} />
        ) : (
          <WrapButton
            name={name}
            ownerData={ownerData}
            profile={profile}
            canBeWrapped={canBeWrapped}
          />
        )}
      </ItemsContainer>
    </Container>
  )
}

export default Token
