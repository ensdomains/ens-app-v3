import { Dispatch, SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'
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

import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import { Spacer } from '@app/components/@atoms/Spacer'
import { Card } from '@app/components/Card'
import { useContractAddress } from '@app/hooks/useContractAddress'
import { useEstimateFullRegistration } from '@app/hooks/useEstimateRegistration'
import { useNameDetails } from '@app/hooks/useNameDetails'

import FullInvoice from '../FullInvoice'
import { RegistrationReducerDataItem } from '../types'

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

    padding: ${theme.space['4']};
    border: 1px solid ${theme.colors.grey};
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
      color: ${theme.colors.background};
      background: ${theme.colors.accent};
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
    border: 1px solid ${theme.colors.grey};
    border-radius: ${theme.radii.large};
    gap: 0;
  `,
)

const StyledRadioButton = styled(RadioButton)``

const RadioButtonContainer = styled.div(
  ({ theme }) => css`
    padding: 8px 15px;
    &:last-child {
      border-top: 1px solid ${theme.colors.grey};
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
  paymentMethodChoice: PaymentMethod
  setPaymentMethodChoice: Dispatch<SetStateAction<PaymentMethod>>
  hasEnoughEth: boolean
}) => {
  const { t } = useTranslation('register')
  return (
    <PaymentChoiceContainer>
      <StyledTitle color="textTertiary" weight="bold">
        Payment method
      </StyledTitle>
      <Spacer $height="2" />
      <StyledRadioButtonGroup
        value={paymentMethodChoice}
        onChange={(e) => setPaymentMethodChoice(e.target.value as PaymentMethod)}
      >
        <RadioButtonContainer>
          <StyledRadioButton
            label={<RadioLabel>Ethereum</RadioLabel>}
            name="RadioButtonGroup"
            value={PaymentMethod.ethereum}
            labelRight
            disabled={hasPendingMoonpayTransaction}
          />
          {paymentMethodChoice === PaymentMethod.ethereum && !hasEnoughEth && (
            <>
              <Spacer $height="2" />
              <Helper type="warning" alignment="horizontal">
                Not enough ETH in wallet
              </Helper>
              <Spacer $height="2" />
            </>
          )}
          {paymentMethodChoice === PaymentMethod.ethereum && hasEnoughEth && (
            <>
              <Spacer $height="2" />
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
                <RadioLabel>Credit or debit card</RadioLabel>
                <Typography>(X% fee)</Typography>
              </>
            }
            name="RadioButtonGroup"
            value={PaymentMethod.moonpay}
            labelRight
          />
          {paymentMethodChoice === PaymentMethod.moonpay && (
            <>
              <Spacer $height="2" />
              <InfoItems>
                {moonpayInfoItems.map((item, idx) => (
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
      </StyledRadioButtonGroup>
    </PaymentChoiceContainer>
  )
}

type Props = {
  registrationData: RegistrationReducerDataItem
  nameDetails: ReturnType<typeof useNameDetails>
  callback: (data: { back?: boolean; paymentMethodChoice?: PaymentMethod }) => void
  onProfileClick: () => void
  resolverExists: boolean | undefined
  hasPrimaryName: boolean
}

const Info = ({
  registrationData,
  nameDetails: { priceData },
  callback,
  onProfileClick,
  resolverExists,
  hasPrimaryName,
  nameDetails,
  transactionStatus,
}: Props) => {
  console.log('transactionStatus: ', transactionStatus)
  const hasPendingMoonpayTransaction = transactionStatus === 'pending'
  const hasFailedMoonpayTransaction = transactionStatus === 'failed'

  const { t } = useTranslation('register')
  const [paymentMethodChoice, setPaymentMethodChoice] = useState(
    hasPendingMoonpayTransaction ? PaymentMethod.moonpay : PaymentMethod.ethereum,
  )
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
      <Typography>{t('steps.info.subheading')}</Typography>
      <FullInvoice {...estimate} />
      {!registrationData.queue.includes('profile') && (
        <ProfileButton data-testid="setup-profile-button" onClick={onProfileClick}>
          <Typography>{t('steps.info.setupProfile')}</Typography>
        </ProfileButton>
      )}
      <PaymentChoice
        {...{
          paymentMethodChoice,
          setPaymentMethodChoice,
          hasEnoughEth,
          hasPendingMoonpayTransaction,
        }}
      />
      {hasPendingMoonpayTransaction && (
        <Helper type="info">
          Your moonpay transaction is processing. This may take up to two minutes. You can check
          your progress from the confirmation email you recieved.
        </Helper>
      )}
      {hasFailedMoonpayTransaction && (
        <Helper type="error">Your moonpay transaction has failed. Please try again.</Helper>
      )}
      <ButtonContainer>
        {!hasPendingMoonpayTransaction && (
          <MobileFullWidth>
            <Button shadowless variant="secondary" onClick={() => callback({ back: true })}>
              {t('action.back', { ns: 'common' })}
            </Button>
          </MobileFullWidth>
        )}
        {hasPendingMoonpayTransaction ? (
          <MobileFullWidth>
            <Button data-testid="next-button" shadowless disabled loading>
              Processing
            </Button>
          </MobileFullWidth>
        ) : (
          <MobileFullWidth>
            <Button
              disabled={paymentMethodChoice === PaymentMethod.ethereum && !hasEnoughEth}
              data-testid="next-button"
              shadowless
              onClick={() => callback({ paymentMethodChoice })}
            >
              {hasFailedMoonpayTransaction
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
