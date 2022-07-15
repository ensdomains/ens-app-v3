import { NightSky } from '@app/assets/NightSky'
import SparklesSVG from '@app/assets/Sparkles.svg'
import { WrapNameGift } from '@app/assets/WrapNameGift'
import { Card } from '@app/components/Card'
import { Outlink } from '@app/components/Outlink'
import { useNFTImage } from '@app/hooks/useAvatar'
import { useChainId } from '@app/hooks/useChainId'
import { TransactionSubmission } from '@app/types'
import { useEns } from '@app/utils/EnsProvider'
import { useTransaction } from '@app/utils/TransactionProvider'
import { Button, mq, Typography } from '@ensdomains/thorin'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

const Container = styled(Card)(
  ({ theme }) => css`
    flex-direction: column;
    align-items: center;
    gap: ${theme.space['3']};
    padding: ${theme.space['3']};

    ${mq.md.min(css`
      flex-direction: row;
      padding-right: ${theme.space['5']};
    `)}
  `,
)

const InnerContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: ${theme.space.full};

    padding: 0 ${theme.space['2']};
    padding-top: ${theme.space['1']};

    ${mq.md.min(css`
      flex-grow: 1;
      flex-direction: row-reverse;
      justify-content: flex-end;
      gap: ${theme.space['6']};
      padding: ${theme.space['2']};
    `)}
  `,
)

const Heading = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.background};
    line-height: ${theme.lineHeights.normal};
  `,
)

const Subheading = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.background};
    opacity: 0.8;
  `,
)

const Sparkles = styled.svg(
  ({ theme }) => css`
    width: ${theme.space['12']};
    height: ${theme.space['12']};
  `,
)

const TextContainer = styled.div(
  () => css`
    width: fit-content;
  `,
)

const UpgradeButton = styled(Button)(
  ({ theme }) => css`
    & {
      background: ${theme.colors.backgroundTertiary};
      color: ${theme.colors.foreground};
    }
    &:hover {
      background: ${theme.colors.background};
    }
    ${mq.md.min(css`
      max-width: ${theme.space['64']};
      height: ${theme.space.full};
    `)}
  `,
)

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

export const WrapperCallToAction = ({ name }: { name: string }) => {
  const { t } = useTranslation('profile')

  const { setCurrentTransaction, getCurrentStep } = useTransaction()
  const currentStep = getCurrentStep(`wrapName-${name}`)
  const { wrapName, setRecords, getProfile, contracts } = useEns()
  const chainId = useChainId()
  const nftUrl = useNFTImage(name, chainId)

  const resumable = currentStep > 0

  const migrateProfileGenerateTx: TransactionSubmission['generateTx'] =
    useCallback(
      async (signer) => {
        const profile = await getProfile(name)
        if (!profile) throw new Error('No profile found')
        if (!profile.records) throw new Error('No records found')
        const { contentHash } = profile.records
        const resolverAddress = (await contracts!.getPublicResolver()!).address
        let migratableContentHash: string | undefined
        if (contentHash) {
          if (typeof contentHash === 'string') {
            migratableContentHash = contentHash
          } else if (typeof contentHash === 'object' && contentHash.decoded) {
            migratableContentHash = `${contentHash.protocolType}://${contentHash.decoded}`
          }
        }

        const migratableProfile = {
          contentHash: migratableContentHash,
          texts: profile.records.texts as {
            key: string
            value: string
          }[],
          coinTypes: profile.records.coinTypes?.map((coinType) => ({
            key: coinType.key as string,
            value: (coinType as any).addr as string,
          })),
        }

        return setRecords(name, {
          records: migratableProfile,
          resolverAddress,
          signer,
        })
      },
      [contracts, getProfile, name, setRecords],
    )

  const wrapNameGenerateTx: TransactionSubmission['generateTx'] = useCallback(
    async (signer, address) =>
      wrapName(name, {
        wrappedOwner: address,
        signer,
      }),
    [name, wrapName],
  )

  const handleUpgradeClick = useCallback(
    () =>
      setCurrentTransaction({
        data: [
          {
            actionName: 'migrateProfile',
            displayItems: [
              {
                label: 'name',
                value: name,
                type: 'name',
              },
            ],
            generateTx: migrateProfileGenerateTx,
          },
          {
            actionName: 'wrapName',
            displayItems: [
              {
                label: 'name',
                value: name,
                type: 'name',
              },
            ],
            completeTitle: t('details.wrap.completeTitle'),
            generateTx: wrapNameGenerateTx,
          },
        ],
        key: `wrapName-${name}`,
        preSteps: (resumeToStep) => ({
          title:
            resumeToStep > 0
              ? t('details.wrap.resumeTitle')
              : t('details.wrap.startTitle'),
          steps: ['migrateProfile', 'wrapName'],
          content: (
            <>
              <GiftWrapper>
                <WrapNameGift
                  imageSrc={nftUrl.image || '/other/TemplateNFTImage.svg'}
                />
              </GiftWrapper>
              <DescriptionWrapper>
                <Typography>
                  {t('details.wrap.description')}
                  <span>
                    <Outlink href="#">
                      {t('action.learnMore', { ns: 'common' })}
                    </Outlink>
                  </span>
                </Typography>
              </DescriptionWrapper>
            </>
          ),
        }),
      }),
    [
      setCurrentTransaction,
      name,
      migrateProfileGenerateTx,
      t,
      wrapNameGenerateTx,
      nftUrl.image,
    ],
  )

  return (
    <NightSky>
      <Container data-testid="wrapper-cta-container">
        <InnerContainer>
          <TextContainer>
            <Heading variant="extraLarge" weight="bold">
              {t('details.wrap.boxTitle')}
            </Heading>
            <Subheading>{t('details.wrap.boxDescription')}</Subheading>
          </TextContainer>
          <Sparkles as={SparklesSVG} />
        </InnerContainer>
        <UpgradeButton
          data-testid="wrapper-cta-button"
          shadowless
          onClick={handleUpgradeClick}
        >
          {resumable
            ? t('details.wrap.resumeLabel')
            : t('details.wrap.startLabel')}
        </UpgradeButton>
      </Container>
    </NightSky>
  )
}
