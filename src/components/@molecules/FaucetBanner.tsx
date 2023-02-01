import { useRouter } from 'next/router'
import { useState } from 'react'
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
  const { isReady } = useRouter()
  const { address } = useAccountSafely()
  const {
    data,
    isLoading,
    mutation: { isLoading: mutationLoading, isError, mutate, isSuccess, error },
  } = useFaucet()
  const dialogStage = isSuccess ? 'success' : 'default'
  const [dialogOpen, setDialogOpen] = useState(false)

  const closeDialog = () => setDialogOpen(false)
  const openDialog = () => setDialogOpen(true)

  if (!data?.eligible || (isLoading && !dialogOpen) || !isReady) return null

  return (
    <>
      <BannerWrapper>
        <StyledBanner
          actionIcon={<RightArrowSVG />}
          icon={<EthSVG />}
          onClick={openDialog}
          alert="info"
          title="You have unclaimed goETH!"
        >
          Each address on goerli can claim <b>0.25 ETH</b> to test out the new ENS manager app, as
          well as all the new contracts.
        </StyledBanner>
      </BannerWrapper>
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
                  Close
                </Button>
              }
              trailing={
                <Button
                  loading={mutationLoading}
                  disabled={mutationLoading}
                  onClick={() => mutate()}
                >
                  Claim
                </Button>
              }
            />
          </>
        ) : (
          <>
            <Dialog.Heading title="Your claim was submitted!" />
            <InnerDialog>
              <LargeCheckIcon as={CheckCircleSVG} />
              <Typography>It may take a few minutes to show up in your wallet.</Typography>
            </InnerDialog>
            <Dialog.Footer center trailing={<Button onClick={closeDialog}>Close</Button>} />
          </>
        )}
      </Dialog>
    </>
  )
}

export default FaucetBanner
