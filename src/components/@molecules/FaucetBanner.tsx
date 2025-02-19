// TODO: Double check conversino to big int

import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { formatEther } from 'viem'

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

import { useAccountSafely } from '@app/hooks/account/useAccountSafely'
import { useChainName } from '@app/hooks/chain/useChainName'
import useFaucet from '@app/hooks/useFaucet'

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

const getAmountFromHex = (hex: `0x${string}`) => formatEther(BigInt(hex))
const msToDays = (ms: number) => Math.floor(ms / 1000 / 60 / 60 / 24)
const chainEthTicker = (chainName: string) => `${chainName.slice(0, 2)}ETH`

const FaucetBanner = () => {
  const chainName = useChainName()
  const { isReady } = useRouter()
  const { address } = useAccountSafely()
  const {
    data,
    isLoading,
    mutation: { isPending: mutationLoading, isError, mutate, isSuccess, error },
  } = useFaucet()
  const dialogStage = isSuccess ? 'success' : 'default'
  const [dialogOpen, setDialogOpen] = useState(false)
  const { t } = useTranslation()

  const closeDialog = () => setDialogOpen(false)
  const openDialog = () => setDialogOpen(true)

  const amount = useMemo(() => getAmountFromHex(data?.amount || '0x0'), [data?.amount])

  useEffect(() => {
    closeDialog()
  }, [chainName, address])

  if ((chainName !== 'goerli' && chainName !== 'sepolia') || !isReady || isLoading || !data)
    return null

  const BannerComponent = (
    <BannerWrapper>
      <StyledBanner
        actionIcon={RightArrowSVG}
        icon={EthSVG}
        onClick={openDialog}
        alert="info"
        title={`You have unclaimed ${chainName} ETH!`}
      >
        {t('testnetFaucet.explanation', {
          amount,
          testnet: chainName,
          ticker: chainEthTicker(chainName),
        })}
      </StyledBanner>
    </BannerWrapper>
  )

  const DialogComponent = (
    <Dialog open={dialogOpen} onClose={closeDialog} onDismiss={closeDialog} variant="blank">
      {dialogStage === 'default' ? (
        <>
          <Dialog.Heading
            title="Faucet Claim"
            subtitle={`Claim once every ${msToDays(data.interval)} days`}
          />
          <Dialog.Content>
            <DisplayItems
              displayItems={[
                {
                  label: 'Value',
                  value: `${amount} ${chainEthTicker(chainName)}`,
                  useRawLabel: true,
                },
                { label: 'Address', value: address || '', type: 'address', useRawLabel: true },
              ]}
            />
            {isError && <Helper alert="error">{(error as Error).message}</Helper>}
          </Dialog.Content>
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
          <Dialog.Content>
            <LargeCheckIcon as={CheckCircleSVG} />
            <Typography>{t('testnetFaucet.note')}</Typography>
          </Dialog.Content>
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
