import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import { WrapNameGift } from '@app/assets/WrapNameGift'
import { Outlink } from '@app/components/Outlink'
import { useNFTImage } from '@app/hooks/useAvatar'
import { useChainId } from '@app/hooks/useChainId'

const GiftWrapper = styled.div(
  ({ theme }) => css`
    width: 100%;
    max-width: min(60vh, ${theme.space['52']});
  `,
)

const DescriptionWrapper = styled(Typography)(
  ({ theme }) => css`
    display: inline;
    text-align: center;
    a {
      display: inline-block;
    }
    margin-bottom: ${theme.space['2']};
  `,
)

export const WrapName = ({ name }: { name: string }) => {
  const { t } = useTranslation('profile')
  const chainId = useChainId()
  const nftUrl = useNFTImage(name, chainId)

  return (
    <>
      <GiftWrapper>
        <WrapNameGift imageSrc={nftUrl.image || '/other/TemplateNFTImage.svg'} />
      </GiftWrapper>
      <DescriptionWrapper>
        <Typography>
          {t('details.wrap.description')}{' '}
          <span>
            <Outlink href="/faq/managing-a-name#what-is-the-name-wrapper">
              {t('action.learnMore', { ns: 'common' })}
            </Outlink>
          </span>
        </Typography>
      </DescriptionWrapper>
    </>
  )
}
