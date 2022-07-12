import SparklesSVG from '@app/assets/Sparkles.svg'
import { WrapNameGift } from '@app/assets/WrapNameGift'
import { DisplayItem } from '@app/components/@molecules/TransactionModal/DisplayItems'
import { Card } from '@app/components/Card'
import { Outlink } from '@app/components/Outlink'
import { useNFTImage } from '@app/hooks/useAvatar'
import { useChainId } from '@app/hooks/useChainId'
import { useEns } from '@app/utils/EnsProvider'
import { useTransaction } from '@app/utils/TransactionProvider'
import { Button, Dialog, mq, Typography } from '@ensdomains/thorin'
import { useCallback, useState } from 'react'
import styled, { css } from 'styled-components'
import { useAccount, useSigner } from 'wagmi'

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
    line-height: ${theme.lineHeights.normal};
  `,
)

const Subheading = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.textTertiary};
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
    ${mq.md.min(css`
      max-width: ${theme.space['80']};
      height: ${theme.space.full};
    `)}
  `,
)

const ButtonShrinkwrap = styled(Button)(
  () => css`
    width: 80%;
    flex-shrink: 1;
    ${mq.md.min(css`
      width: 100%;
    `)}
  `,
)

const InnerDialog = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: ${theme.space.full};
    padding: 0 ${theme.space['5']};
    gap: ${theme.space['2.5']};
    max-height: 60vh;
    overflow-y: auto;
    ${mq.md.min(css`
      min-width: ${theme.space['128']};
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
  const [dialogOpen, setDialogOpen] = useState(false)
  const { setCurrentTransaction, getCurrentStep } = useTransaction()
  const currentStep = getCurrentStep(`wrapName-${name}`)
  const { wrapName, setRecords, getProfile, contracts } = useEns()

  const { data: accountData } = useAccount()
  const { data: signer } = useSigner()
  const chainId = useChainId()
  const nftUrl = useNFTImage(name, chainId)

  const resumable = currentStep > 0

  const migrateProfileGenerateTx = useCallback(async () => {
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
      signer: signer!,
    })
  }, [contracts, getProfile, name, setRecords, signer])

  const wrapNameGenerateTx = useCallback(
    async () =>
      wrapName(name, {
        wrappedOwner: accountData!.address!,
        signer: signer!,
      }),
    [accountData, name, signer, wrapName],
  )

  return (
    <Container>
      <InnerContainer>
        <TextContainer>
          <Heading variant="extraLarge" weight="bold">
            Unlock new features
          </Heading>
          <Subheading>
            Upgrading your name unlocks the latest functionality of ENS
          </Subheading>
        </TextContainer>
        <Sparkles as={SparklesSVG} />
      </InnerContainer>
      <UpgradeButton shadowless onClick={() => setDialogOpen(true)}>
        {resumable ? 'Resume Upgrade' : 'Upgrade'}
      </UpgradeButton>
      <Dialog
        open={dialogOpen}
        variant="actionable"
        currentStep={currentStep}
        stepCount={2}
        stepStatus="notStarted"
        title={resumable ? 'Resume your upgrade' : 'Upgrade your name'}
        onDismiss={() => setDialogOpen(false)}
        leading={
          <ButtonShrinkwrap
            onClick={() => setDialogOpen(false)}
            variant="secondary"
            tone="grey"
            shadowless
          >
            Cancel
          </ButtonShrinkwrap>
        }
        trailing={
          <Button
            onClick={() => {
              setDialogOpen(false)
              setCurrentTransaction({
                data: [
                  {
                    actionName: 'migrateProfile',
                    displayItems: [
                      {
                        label: 'Name',
                        value: name,
                        type: 'name',
                      },
                      {
                        label: 'Info',
                        value: 'Set existing records on new resolver',
                      },
                    ],
                    generateTx: migrateProfileGenerateTx,
                  },
                  {
                    actionName: 'wrapName',
                    displayItems: [
                      {
                        label: 'Name',
                        value: name,
                        type: 'name',
                      },
                      {
                        label: 'Info',
                        value: 'Wrap name and set new resolver',
                      },
                    ],
                    completeTitle: 'Upgrade Complete',
                    generateTx: wrapNameGenerateTx,
                  },
                ],
                key: `wrapName-${name}`,
              })
            }}
            shadowless
          >
            {resumable ? 'Resume' : 'Start'}
          </Button>
        }
      >
        <InnerDialog>
          <GiftWrapper>
            <WrapNameGift
              imageSrc={nftUrl.image || '/other/TemplateNFTImage.svg'}
            />
          </GiftWrapper>
          <DescriptionWrapper>
            <Typography>
              Upgrading or &quot;wrapping&quot; your name gives it new features.{' '}
              <span>
                <Outlink href="#">Learn more</Outlink>
              </span>
            </Typography>
          </DescriptionWrapper>
          <DisplayItem
            fade={currentStep > 0}
            shrink
            label="Step 1"
            value="Migrate profile"
          />
          <DisplayItem shrink label="Step 2" value="Wrap name" />
        </InnerDialog>
      </Dialog>
    </Container>
  )
}
