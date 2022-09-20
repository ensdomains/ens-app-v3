import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { RecordOptions } from '@ensdomains/ensjs/utils/recordHelpers'
import { Button, mq } from '@ensdomains/thorin'

import AdvancedEditorContent from '@app/components/@molecules/AdvancedEditor/AdvancedEditorTabContent'
import AdvancedEditorTabs from '@app/components/@molecules/AdvancedEditor/AdvancedEditorTabs'
import AddRecord from '@app/components/@molecules/ProfileEditor/AddRecord'
import useAdvancedEditor from '@app/hooks/useAdvancedEditor'
import { useProfile } from '@app/hooks/useProfile'

const Container = styled.form(({ theme }) => [
  css`
    width: calc(100% + 2 * ${theme.space['3.5']});
    height: calc(100% + 2 * ${theme.space['3.5']});
    max-height: 90vh;
    margin: -${theme.space[3.5]};
    background: ${theme.colors.white};
    border-radius: ${theme.space['5']};
    overflow: hidden;
    display: flex;
    flex-direction: column;
  `,
  mq.sm.min`
    width: 95vw;
    max-width: 600px;
  `,
])

const NameContainer = styled.div(({ theme }) => [
  css`
    display: block;
    width: 100%;
    padding-top: ${theme.space['6']};
    padding-left: ${theme.space['7']};
    padding-right: ${theme.space['4']};
    letter-spacing: ${theme.letterSpacings['-0.01']};
    line-height: 45px;
    vertical-align: middle;
    text-align: center;
    font-feature-settings: 'ss01' on, 'ss03' on, 'ss04' on;
    font-weight: ${theme.fontWeights.bold};
    font-size: ${theme.space['6']};
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  `,
  mq.sm.min(css`
    text-align: left;
  `),
])

const ContentContainer = styled.div(
  ({ theme }) => css`
    flex: 1;
    display: flex;
    margin-top: ${theme.space['4.5']};
    flex-direction: column;
    overflow: hidden;
    gap: ${theme.space['4']};
  `,
)

const FooterContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    gap: ${theme.space['3']};
    padding: 0 ${theme.space['4']} ${theme.space['4']} ${theme.space['4']};
    width: 100%;
    max-width: ${theme.space['96']};
    margin: 0 auto;
  `,
)

type Props = {
  profile: ReturnType<typeof useProfile>['profile']
  onDismiss: () => void
  onSubmit: (records: RecordOptions) => void
}

const Records = ({ profile, onSubmit, onDismiss }: Props) => {
  const { t } = useTranslation('profile')

  const advancedEditorForm = useAdvancedEditor({
    profile,
    loading: false,
    callback: onSubmit,
  })
  const { AddButtonProps, hasErrors, hasChanges, handleSubmit } = advancedEditorForm

  return (
    <Container onSubmit={handleSubmit} data-testid="advanced-editor">
      <NameContainer>{t('advancedEditor.title', { name: 'Custom' })}</NameContainer>
      <ContentContainer>
        <AdvancedEditorTabs {...advancedEditorForm} />
        <AdvancedEditorContent {...advancedEditorForm} />
        <AddRecord AddButtonProps={AddButtonProps} />
        <FooterContainer>
          <Button tone="grey" variant="secondary" shadowless onClick={onDismiss}>
            {t('action.cancel', { ns: 'common' })}
          </Button>
          <Button disabled={hasErrors || !hasChanges} type="submit" shadowless>
            {t('action.save', { ns: 'common' })}
          </Button>
        </FooterContainer>
      </ContentContainer>
    </Container>
  )
}

export default Records
