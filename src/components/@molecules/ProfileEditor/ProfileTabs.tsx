import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { Theme } from 'typings-custom/styled-components'

import useProfileEditor from '@app/hooks/useProfileEditor'

const TabButtonsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex: 0 0 auto;
    gap: ${theme.space['1.25']} ${theme.space['3']};
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0 ${theme.space['6']};
  `,
)

const getIndicatorStyle = (
  theme: Theme,
  $selected?: boolean,
  $hasError?: boolean,
  $isDirty?: boolean,
) => {
  let color = ''
  if ($hasError) color = theme.colors.red
  else if ($selected && $isDirty) color = theme.colors.accent
  else if ($isDirty) color = theme.colors.green
  if (!color) return ''
  return css`
    :after {
      content: '';
      position: absolute;
      background-color: ${color};
      width: 12px;
      height: 12px;
      border: 1px solid ${theme.colors.backgroundPrimary};
      box-sizing: border-box;
      border-radius: 50%;
      top: 0;
      right: 0;
      transform: translate(70%, 0%);
    }
  `
}

const TabButton = styled.button<{
  $selected?: boolean
  $hasError?: boolean
  $isDirty?: boolean
}>(
  ({ theme, $selected, $hasError, $isDirty }) => css`
    position: relative;
    display: block;
    outline: none;
    border: none;
    padding: 0;
    margin: 0;
    background: none;
    color: ${$selected ? theme.colors.accent : theme.colors.textTertiary};
    font-size: 1.25rem;
    transition: all 0.15s ease-in-out;
    cursor: pointer;
    font-weight: ${theme.fontWeights.bold};

    &:hover {
      color: ${$selected ? theme.colors.accent : theme.colors.textSecondary};
    }

    ${getIndicatorStyle(theme, $selected, $hasError, $isDirty)}
  `,
)

type Props = ReturnType<typeof useProfileEditor>

const ProfileEditorTabs = ({ formState, getFieldState, tab, handleTabClick }: Props) => {
  const { t } = useTranslation('transactionFlow')
  return (
    <TabButtonsContainer>
      <TabButton
        type="button"
        $selected={tab === 'general'}
        $hasError={!!getFieldState('general', formState).error}
        $isDirty={getFieldState('general').isDirty}
        onClick={handleTabClick('general')}
      >
        {t('input.profileEditor.tabs.general.label')}
      </TabButton>
      <TabButton
        type="button"
        $selected={tab === 'accounts'}
        $hasError={!!getFieldState('accounts', formState).error}
        $isDirty={getFieldState('accounts').isDirty}
        onClick={handleTabClick('accounts')}
        data-testid="accounts-tab"
      >
        {t('input.profileEditor.tabs.accounts.label')}
      </TabButton>
      <TabButton
        type="button"
        $selected={tab === 'address'}
        $hasError={!!getFieldState('address', formState).error}
        $isDirty={getFieldState('address').isDirty}
        onClick={handleTabClick('address')}
        data-testid="address-tab"
      >
        {t('input.profileEditor.tabs.address.label')}
      </TabButton>
      <TabButton
        type="button"
        $selected={tab === 'website'}
        $hasError={!!getFieldState('website', formState).error}
        $isDirty={getFieldState('website').isDirty}
        onClick={handleTabClick('website')}
        data-testid="website-tab"
      >
        {t('input.profileEditor.tabs.contentHash.label')}
      </TabButton>
      <TabButton
        type="button"
        $selected={tab === 'other'}
        $hasError={!!getFieldState('other', formState).error}
        $isDirty={getFieldState('other').isDirty}
        onClick={handleTabClick('other')}
        data-testid="other-tab"
      >
        {t('input.profileEditor.tabs.other.label')}
      </TabButton>
    </TabButtonsContainer>
  )
}

export default ProfileEditorTabs
