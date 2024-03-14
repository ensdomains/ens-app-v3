import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useEnsAvatar } from 'wagmi'

import { Typography } from '@ensdomains/thorin'

import { WrapNameGift } from '@app/assets/WrapNameGift'
import { Outlink } from '@app/components/Outlink'
import { ensAvatarConfig } from '@app/utils/query/ipfsGateway'
import { getSupportLink } from '@app/utils/supportLinks'

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
  const { data: nftUrl } = useEnsAvatar({ ...ensAvatarConfig, name })

  return (
    <>
      <GiftWrapper>
        <WrapNameGift imageSrc={nftUrl || '/other/TemplateNFTImage.svg'} />
      </GiftWrapper>
      <DescriptionWrapper>
        <Typography>
          {t('details.wrap.description')}{' '}
          <span>
            <Outlink href={getSupportLink('nameWrapper')}>
              {t('action.learnMore', { ns: 'common' })}
            </Outlink>
          </span>
        </Typography>
      </DescriptionWrapper>
    </>
  )
}
