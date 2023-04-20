import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dialog, RadioButton, ScrollBox, Typography } from '@ensdomains/thorin'

import type { SelectedProfile } from '../ResolverWarningOverlay'
import { CenteredTypography } from '../components/CenteredTypography'
import { ProfileBlurb } from '../components/ProfileBlurb'
import { StyledInnerDialog } from '../components/StyledInnerDialog'

const ContentContainer = styled.div(
  ({ theme }) => css`
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-bottom: ${theme.space['4']};
    gap: ${theme.space['4']};
  `,
)

const RadioGroupContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['6']};
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
  currentResolver: string
  latestResolver: string
  selected: SelectedProfile
  onChangeSelected: (selected: SelectedProfile) => void
  onNext: () => void
  onBack: () => void
}
export const MigrateProfileSelectorView = ({
  name,
  currentResolver,
  latestResolver,
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
      <StyledInnerDialog>
        <ScrollBox>
          <ContentContainer>
            <CenteredTypography>
              {t('input.profileEditor.warningOverlay.migrateProfileSelector.subtitle')}
            </CenteredTypography>
            <RadioGroupContainer>
              {/* <StyledRadioButtonGroup
              style={{ width: '100%' }}
              value={selected}
              onChange={(e) => onChangeSelected(e.currentTarget.value as SelectedProfile)}
            > */}
              <RadioButton
                label={
                  <RadioLabelContainer>
                    <RadioInfoContainer>
                      <Typography fontVariant="bodyBold">
                        {t(
                          'input.profileEditor.warningOverlay.migrateProfileSelector.option.latest',
                        )}
                      </Typography>
                    </RadioInfoContainer>
                    <ProfileBlurb name={name} resolver={latestResolver} />
                  </RadioLabelContainer>
                }
                name="resolver-option"
                value="latest"
                checked={selected === 'latest'}
                onChange={() => onChangeSelected('latest')}
              />
              <RadioButton
                label={
                  <RadioLabelContainer>
                    <RadioInfoContainer>
                      <Typography fontVariant="bodyBold">
                        {t(
                          'input.profileEditor.warningOverlay.migrateProfileSelector.option.current',
                        )}
                      </Typography>
                    </RadioInfoContainer>
                    <ProfileBlurb name={name} resolver={currentResolver} />
                  </RadioLabelContainer>
                }
                name="resolver-option"
                value="current"
                checked={selected === 'current'}
                onChange={() => onChangeSelected('current')}
              />
              <RadioButton
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
              {/* </StyledRadioButtonGroup> */}
            </RadioGroupContainer>
          </ContentContainer>
        </ScrollBox>
      </StyledInnerDialog>
      <Dialog.Footer
        leading={
          <Button
            colorStyle="accentSecondary"
            onClick={onBack}
            data-testid="warning-overlay-secondary-action"
          >
            {t('action.back', { ns: 'common' })}
          </Button>
        }
        trailing={
          <Button onClick={onNext} data-testid="profile-editor-overlay-button">
            {t('action.next', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}
