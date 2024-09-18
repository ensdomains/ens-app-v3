import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { Address } from 'viem'

import { Button, Dialog, RadioButton, Typography } from '@ensdomains/thorin'

import { CenteredTypography } from '../components/CenteredTypography'
import { ProfileBlurb } from '../components/ProfileBlurb'
import type { SelectedProfile } from '../ResolverWarningOverlay'

const RadioGroupContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['6']};
    width: ${theme.space.full};
  `,
)

const RadioLabelContainer = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: ${theme.space['2']};
  `,
)

const RadioInfoContainer = styled.div(
  () => css`
    display: flex;
    flex-direction: column;
  `,
)

type Props = {
  name: string
  currentResolverAddress: Address
  latestResolverAddress: Address
  hasCurrentProfile: boolean
  selected: SelectedProfile
  onChangeSelected: (selected: SelectedProfile) => void
  onNext: () => void
  onBack: () => void
}
export const MigrateProfileSelectorView = ({
  name,
  currentResolverAddress,
  latestResolverAddress,
  hasCurrentProfile,
  selected,
  onChangeSelected,
  onNext,
  onBack,
}: Props) => {
  const { t } = useTranslation('transactionFlow')
  return (
    <>
      <Dialog.Heading
        title={t('input.profileEditor.warningOverlay.migrateProfileSelector.title')}
      />
      <Dialog.Content>
        <CenteredTypography>
          {t('input.profileEditor.warningOverlay.migrateProfileSelector.subtitle')}
        </CenteredTypography>
        <RadioGroupContainer>
          <RadioButton
            data-testid="migrate-profile-selector-latest"
            label={
              <RadioLabelContainer>
                <RadioInfoContainer>
                  <Typography fontVariant="bodyBold">
                    {t('input.profileEditor.warningOverlay.migrateProfileSelector.option.latest')}
                  </Typography>
                </RadioInfoContainer>
                <ProfileBlurb name={name} resolverAddress={latestResolverAddress} />
              </RadioLabelContainer>
            }
            name="resolver-option"
            value="latest"
            checked={selected === 'latest'}
            onChange={() => onChangeSelected('latest')}
          />
          {hasCurrentProfile && (
            <RadioButton
              data-testid="migrate-profile-selector-current"
              label={
                <RadioLabelContainer>
                  <RadioInfoContainer>
                    <Typography fontVariant="bodyBold">
                      {t(
                        'input.profileEditor.warningOverlay.migrateProfileSelector.option.current',
                      )}
                    </Typography>
                  </RadioInfoContainer>
                  <ProfileBlurb name={name} resolverAddress={currentResolverAddress} />
                </RadioLabelContainer>
              }
              name="resolver-option"
              value="current"
              checked={selected === 'current'}
              onChange={() => onChangeSelected('current')}
            />
          )}
          <RadioButton
            data-testid="migrate-profile-selector-reset"
            label={
              <RadioInfoContainer>
                <Typography fontVariant="bodyBold">
                  {t('input.profileEditor.warningOverlay.migrateProfileSelector.option.reset')}
                </Typography>
                <Typography color="grey">
                  {t(
                    'input.profileEditor.warningOverlay.migrateProfileSelector.option.resetSubtitle',
                  )}
                </Typography>
              </RadioInfoContainer>
            }
            name="resolver-option"
            value="reset"
            checked={selected === 'reset'}
            onChange={() => onChangeSelected('reset')}
          />
        </RadioGroupContainer>
      </Dialog.Content>
      <Dialog.Footer
        leading={
          <Button
            colorStyle="accentSecondary"
            onClick={onBack}
            data-testid="warning-overlay-back-button"
          >
            {t('action.back', { ns: 'common' })}
          </Button>
        }
        trailing={
          <Button onClick={onNext} data-testid="warning-overlay-next-button">
            {t('action.next', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}
