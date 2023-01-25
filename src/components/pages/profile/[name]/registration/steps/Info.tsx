import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePrevious } from 'react-use'
import styled, { css } from 'styled-components'
import { useAccount, useBalance } from 'wagmi'

import {
  Button,
  Heading,
  Helper,
  RadioButton,
  RadioButtonGroup,
  Typography,
  mq,
} from '@ensdomains/thorin'

import MoonpayLogo from '@app/assets/MoonpayLogo.svg'
import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import { Spacer } from '@app/components/@atoms/Spacer'
import { Card } from '@app/components/Card'
import { useContractAddress } from '@app/hooks/useContractAddress'
import { useEstimateFullRegistration } from '@app/hooks/useEstimateRegistration'
import { useNameDetails } from '@app/hooks/useNameDetails'

import FullInvoice from '../FullInvoice'
import { MoonpayTransactionStatus, RegistrationReducerDataItem } from '../types'

const StyledCard = styled(Card)(
  ({ theme }) => css`
    max-width: 780px;
    margin: 0 auto;
    flex-direction: column;
    gap: ${theme.space['4']};
    padding: ${theme.space['4']};

    ${mq.md.min(css`
      padding: ${theme.space['6']} ${theme.space['18']};
      gap: ${theme.space['6']};
    `)}
  `,
)

const InfoItems = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['4']};

    ${mq.md.min(css`
      flex-direction: row;
      align-items: stretch;
    `)}
  `,
)

const InfoItem = styled.div(
  ({ theme }) => css`
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['4']};
    background: ${theme.colors.backgroundSecondary};

    padding: ${theme.space['4']};
    border-radius: ${theme.radii.large};
    text-align: center;

    & > div:first-of-type {
      width: ${theme.space['10']};
      height: ${theme.space['10']};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${theme.fontSizes.extraLarge};
      font-weight: ${theme.fontWeights.bold};
      color: ${theme.colors.backgroundPrimary};
      background: ${theme.colors.accentPrimary};
      border-radius: ${theme.radii.full};
    }

    & > div:last-of-type {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `,
)

const ButtonContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
  `,
)

const ProfileButton = styled.button(
  ({ theme }) => css`
    color: ${theme.colors.accent};
    font-weight: bold;
    cursor: pointer;
  `,
)

const ethInfoItems = Array.from({ length: 3 }, (_, i) => `steps.info.ethItems.${i}`)
const moonpayInfoItems = Array.from({ length: 2 }, (_, i) => `steps.info.moonpayItems.${i}`)

const PaymentChoiceContainer = styled.div`
  width: 100%;
`

const StyledRadioButtonGroup = styled(RadioButtonGroup)(
  ({ theme }) => css`
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radii.large};
    gap: 0;
  `,
)

const StyledRadioButton = styled(RadioButton)``

const RadioButtonContainer = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['4']};
    &:last-child {
      border-top: 1px solid ${theme.colors.border};
    }
  `,
)

const StyledTitle = styled(Typography)`
  margin-left: 15px;
`

const RadioLabel = styled(Typography)(
  ({ theme }) => css`
    margin-right: 10px;
    color: ${theme.colors.text};
  `,
)

const MoonpayContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
`

export enum PaymentMethod {
  ethereum = 'ethereum',
  moonpay = 'moonpay',
}

const PaymentChoice = ({
  paymentMethodChoice,
  setPaymentMethodChoice,
  hasEnoughEth,
  hasPendingMoonpayTransaction,
}: {
  paymentMethodChoice: PaymentMethod | ''
  setPaymentMethodChoice: Dispatch<SetStateAction<PaymentMethod | ''>>
  hasEnoughEth: boolean
  hasPendingMoonpayTransaction: boolean
}) => {
  const { t } = useTranslation('register')

  return (
    <PaymentChoiceContainer>
      <StyledTitle color="textTertiary" weight="bold">
        {t('steps.info.paymentMethod')}
      </StyledTitle>
      <Spacer $height="2" />
      <StyledRadioButtonGroup
        value={paymentMethodChoice}
        onChange={(e) => setPaymentMethodChoice(e.target.value as PaymentMethod)}
      >
        <RadioButtonContainer>
          <StyledRadioButton
            label={<RadioLabel>{t('steps.info.ethereum')}</RadioLabel>}
            name="RadioButtonGroup"
            value={PaymentMethod.ethereum}
            disabled={hasPendingMoonpayTransaction}
            checked={paymentMethodChoice === PaymentMethod.ethereum || undefined}
          />
          {paymentMethodChoice === PaymentMethod.ethereum && !hasEnoughEth && (
            <>
              <Spacer $height="4" />
              <Helper type="warning" alignment="horizontal">
                {t('steps.info.notEnoughEth')}
              </Helper>
              <Spacer $height="2" />
            </>
          )}
          {paymentMethodChoice === PaymentMethod.ethereum && hasEnoughEth && (
            <>
              <Spacer $height="4" />
              <InfoItems>
                {ethInfoItems.map((item, idx) => (
                  <InfoItem key={item}>
                    <Typography>{idx + 1}</Typography>
                    <Typography>{t(item)}</Typography>
                  </InfoItem>
                ))}
              </InfoItems>
              <Spacer $height="2" />
            </>
          )}
        </RadioButtonContainer>
        <RadioButtonContainer>
          <StyledRadioButton
            label={
              <>
                <RadioLabel>{t('steps.info.creditOrDebit')}</RadioLabel>
                <br />
                <Typography color="textTertiary" weight="light">
                  ({t('steps.info.additionalFee')})
                </Typography>
              </>
            }
            name="RadioButtonGroup"
            value={PaymentMethod.moonpay}
            checked={paymentMethodChoice === PaymentMethod.moonpay || undefined}
          />
          {paymentMethodChoice === PaymentMethod.moonpay && (
            <>
              <Spacer $height="4" />
              <InfoItems>
                {moonpayInfoItems.map((item, idx) => (
                  <InfoItem key={item}>
                    <Typography>{idx + 1}</Typography>
                    <Typography>{t(item)}</Typography>
                  </InfoItem>
                ))}
              </InfoItems>
              <Spacer $height="4" />
              <MoonpayContainer>
                {t('steps.info.poweredBy')}
                <MoonpayLogo />
              </MoonpayContainer>
            </>
          )}
        </RadioButtonContainer>
      </StyledRadioButtonGroup>
    </PaymentChoiceContainer>
  )
}

type Props = {
  registrationData: RegistrationReducerDataItem
  nameDetails: ReturnType<typeof useNameDetails>
  callback: (data: { back?: boolean; paymentMethodChoice?: PaymentMethod | '' }) => void
  onProfileClick: () => void
  resolverExists: boolean | undefined
  hasPrimaryName: boolean
  moonpayTransactionStatus?: MoonpayTransactionStatus
}

const Info = ({
  registrationData,
  nameDetails: { priceData },
  callback,
  onProfileClick,
  resolverExists,
  hasPrimaryName,
  nameDetails,
  moonpayTransactionStatus,
}: Props) => {
  const hasPendingMoonpayTransaction = moonpayTransactionStatus === 'pending'
  const hasFailedMoonpayTransaction = moonpayTransactionStatus === 'failed'

  const previousMoonpayTransactionStatus = usePrevious(moonpayTransactionStatus)

  const { t } = useTranslation('register')
  const [paymentMethodChoice, setPaymentMethodChoice] = useState<PaymentMethod | ''>(
    hasPendingMoonpayTransaction ? PaymentMethod.moonpay : '',
  )

  // Keep radio button choice up to date
  useEffect(() => {
    if (moonpayTransactionStatus) {
      setPaymentMethodChoice(
        hasPendingMoonpayTransaction || hasFailedMoonpayTransaction ? PaymentMethod.moonpay : '',
      )
    }
  }, [
    hasFailedMoonpayTransaction,
    hasPendingMoonpayTransaction,
    moonpayTransactionStatus,
    previousMoonpayTransactionStatus,
    setPaymentMethodChoice,
  ])

  const { address } = useAccount()
  const { data: balance } = useBalance({ addressOrName: address })
  const resolverAddress = useContractAddress('PublicResolver')
  const [reverseRecord] = useState(registrationData.reverseRecord || !hasPrimaryName)
  const [years] = useState(registrationData.years)

  const estimate = useEstimateFullRegistration({ registration: registrationData, price: priceData })

  const fullEstimate = useEstimateFullRegistration({
    registration: {
      permissions: {},
      records: {
        coinTypes: [{ key: 'ETH', value: resolverAddress }],
        clearRecords: resolverExists,
      },
      resolver: resolverAddress,
      reverseRecord,
      years,
    },
    price: nameDetails.priceData,
  })
  const { premiumFee, totalYearlyFee, estimatedGasFee } = fullEstimate

  const yearlyRequiredBalance = totalYearlyFee?.mul(110).div(100)
  const totalRequiredBalance = yearlyRequiredBalance?.add(premiumFee || 0).add(estimatedGasFee || 0)
  const hasEnoughEth = !balance?.value.lt(totalRequiredBalance || 0)

  return (
    <StyledCard>
      <Heading>{t('steps.info.heading')}</Heading>
      <FullInvoice {...estimate} />
      <PaymentChoice
        {...{
          paymentMethodChoice,
          setPaymentMethodChoice,
          hasEnoughEth,
          hasPendingMoonpayTransaction,
        }}
      />
      {hasPendingMoonpayTransaction && (
        <Helper type="info">{t('steps.info.pendingMoonpayTransaction')}</Helper>
      )}
      {hasFailedMoonpayTransaction && (
        <Helper type="error">{t('steps.info.failedMoonpayTransaction')}</Helper>
      )}
      {!registrationData.queue.includes('profile') && (
        <ProfileButton data-testid="setup-profile-button" onClick={onProfileClick}>
          <Typography color="accent">{t('steps.info.setupProfile')}</Typography>
        </ProfileButton>
      )}
      <ButtonContainer>
        {!hasPendingMoonpayTransaction && (
          <MobileFullWidth>
            <Button onClick={() => callback({ back: true })}>
              {t('action.back', { ns: 'common' })}
            </Button>
          </MobileFullWidth>
        )}
        {hasPendingMoonpayTransaction ? (
          <MobileFullWidth>
            <Button data-testid="next-button" disabled loading>
              {t('steps.info.processing')}
            </Button>
          </MobileFullWidth>
        ) : (
          <MobileFullWidth>
            <Button
              disabled={paymentMethodChoice === PaymentMethod.ethereum && !hasEnoughEth}
              data-testid="next-button"
              onClick={() => callback({ paymentMethodChoice })}
            >
              {hasFailedMoonpayTransaction && paymentMethodChoice === PaymentMethod.moonpay
                ? t('action.tryAgain', { ns: 'common' })
                : t('action.begin', { ns: 'common' })}
            </Button>
          </MobileFullWidth>
        )}
      </ButtonContainer>
    </StyledCard>
  )
}

export default Info
