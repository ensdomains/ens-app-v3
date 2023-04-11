import { useRouter } from 'next/router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import {
  Banner,
  Button,
  CheckCircleSVG,
  Dialog,
  EthSVG,
  Helper,
  RightArrowSVG,
  Typography,
} from '@ensdomains/thorin'

import { useAccountSafely } from '@app/hooks/useAccountSafely'
import { useChainId } from '@app/hooks/useChainId'
import useFaucet from '@app/hooks/useFaucet'

import { InnerDialog } from '../@atoms/InnerDialog'
import { DisplayItems } from './TransactionDialogManager/DisplayItems'

const BannerWrapper = styled.div(
  () => css`
    position: relative;
    width: 100%;
    height: 0;
  `,
)

const StyledBanner = styled(Banner)(
  () => css`
    position: absolute;
    cursor: pointer;
  `,
)

const LargeCheckIcon = styled.svg(
  ({ theme }) => css`
    width: ${theme.space['12']};
    height: ${theme.space['12']};
    color: ${theme.colors.green};
  `,
)

const FaucetBanner = () => {
  const chainId = useChainId()
  const { isReady } = useRouter()
  const { address } = useAccountSafely()
  const {
    data,
    isLoading,
    mutation: { isLoading: mutationLoading, isError, mutate, isSuccess, error },
  } = useFaucet()
  const dialogStage = isSuccess ? 'success' : 'default'
  const [dialogOpen, setDialogOpen] = useState(false)
  const { t } = useTranslation()

  const closeDialog = () => setDialogOpen(false)
  const openDialog = () => setDialogOpen(true)

  if (chainId !== 5 || !isReady) return null

  const BannerComponent = (
    <BannerWrapper>
      <StyledBanner
        actionIcon={<RightArrowSVG />}
        icon={<EthSVG />}
        onClick={openDialog}
        alert="info"
        title="You have unclaimed goETH!"
      >
        {t('testnetFaucet.explanation', { amount: '0.25' })}
      </StyledBanner>
    </BannerWrapper>
  )

  const DialogComponent = (
    <Dialog open={dialogOpen} onClose={closeDialog} onDismiss={closeDialog} variant="blank">
      {dialogStage === 'default' ? (
        <>
          <Dialog.Heading title="Faucet Claim" subtitle="Claim once every 90 days" />
          <InnerDialog>
            <DisplayItems
              displayItems={[
                { label: 'Value', value: '0.25 goETH', useRawLabel: true },
                { label: 'Address', value: address || '', type: 'address', useRawLabel: true },
              ]}
            />
            {isError && <Helper type="error">{(error as Error).message}</Helper>}
          </InnerDialog>
          <Dialog.Footer
            leading={
              <Button colorStyle="accentSecondary" onClick={closeDialog}>
                {t('action.close')}
              </Button>
            }
            trailing={
              <Button loading={mutationLoading} disabled={mutationLoading} onClick={() => mutate()}>
                {t('action.claim')}
              </Button>
            }
          />
        </>
      ) : (
        <>
          <Dialog.Heading title="Your claim was submitted!" />
          <InnerDialog>
            <LargeCheckIcon as={CheckCircleSVG} />
            <Typography>{t('testnetFaucet.note')}</Typography>
          </InnerDialog>
          <Dialog.Footer trailing={<Button onClick={closeDialog}>{t('action.close')}</Button>} />
        </>
      )}
    </Dialog>
  )

  return (
    <>
      {data?.eligible && !isLoading && BannerComponent}
      {address && DialogComponent}
    </>
  )
}

export default FaucetBanner
