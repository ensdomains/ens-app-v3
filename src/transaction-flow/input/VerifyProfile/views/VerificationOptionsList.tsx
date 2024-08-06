import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dialog } from '@ensdomains/thorin'

import DentitySVG from '@app/assets/verification/Dentity.svg'
import VerifiedRecordSVG from '@app/assets/VerifiedRecord.svg'
import type { useVerifiedRecords } from '@app/hooks/verification/useVerifiedRecords/useVerifiedRecords'

import { CenteredTypography } from '../../ProfileEditor/components/CenteredTypography'
import { VerificationOptionButton } from '../components/VerificationOptionButton'
import type { VerificationProtocol } from '../VerifyProfile-flow'

type VerificationOption = {
  label: string
  value: VerificationProtocol
  icon: JSX.Element
}

const VERIFICATION_OPTIONS: VerificationOption[] = [
  {
    label: 'Dentity',
    value: 'dentity',
    icon: <DentitySVG />,
  },
]

const IconWrapper = styled.div(
  ({ theme }) => css`
    svg {
      color: ${theme.colors.accent};
      width: ${theme.space['16']};
      height: ${theme.space['16']};
      display: block;
    }
  `,
)

const OptionsList = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['2']};
    width: 100%;
    overflow: hidden;
    padding-top: ${theme.space.px};
    margin-top: -${theme.space.px};
  `,
)

export const VerificationOptionsList = ({
  verificationData,
  onSelect,
  onDismiss,
}: {
  verificationData?: ReturnType<typeof useVerifiedRecords>['data']
  onSelect: (protocol: VerificationProtocol) => void
  onDismiss?: () => void
}) => {
  const { t } = useTranslation('transactionFlow')
  return (
    <>
      <IconWrapper>
        <VerifiedRecordSVG />
      </IconWrapper>
      <Dialog.Heading title={t('input.verifyProfile.list.title')} />
      <Dialog.Content>
        <CenteredTypography>{t('input.verifyProfile.list.message')}</CenteredTypography>
        <OptionsList>
          {VERIFICATION_OPTIONS.map(({ label, value, icon }) => (
            <VerificationOptionButton
              key={value}
              verified={!!verificationData?.some(({ issuer }) => issuer === 'dentity')}
              icon={icon}
              onClick={() => onSelect?.(value)}
            >
              {label}
            </VerificationOptionButton>
          ))}
        </OptionsList>
      </Dialog.Content>
      <Dialog.Footer
        trailing={
          <Button colorStyle="accentSecondary" onClick={onDismiss}>
            {t('action.close', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}
