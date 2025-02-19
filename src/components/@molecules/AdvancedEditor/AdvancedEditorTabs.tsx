import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { Theme } from 'typings-custom/styled-components'

import useAdvancedEditor from '@app/hooks/useAdvancedEditor'

const TabButtonsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-wrap: wrap;
    gap: ${theme.space['1.25']} ${theme.space['3']};
    padding: 0 ${theme.space['4']} 0 ${theme.space['2']};
    width: ${theme.space.full};
    @media (min-width: ${theme.breakpoints.sm}px) {
      padding: 0 ${theme.space['2']};
      margin: -${theme.space['1.5']} 0 -${theme.space['2']};
    }
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
    ::after {
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
    color: ${$selected ? theme.colors.accent : theme.colors.grey};
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

type Props = ReturnType<typeof useAdvancedEditor>

const AdvancedEditorTabs = ({ tab, formState, getFieldState, handleTabClick }: Props) => {
  const { t } = useTranslation('profile')

  return (
    <TabButtonsContainer>
      <TabButton
        $selected={tab === 'text'}
        $hasError={!!getFieldState('text', formState).error}
        $isDirty={getFieldState('text').isDirty}
        onClick={handleTabClick('text')}
        data-testid="text-tab"
        type="button"
      >
        {t('advancedEditor.tabs.text.label')}
      </TabButton>
      <TabButton
        $selected={tab === 'address'}
        $hasError={!!getFieldState('address', formState).error}
        $isDirty={getFieldState('address').isDirty}
        onClick={handleTabClick('address')}
        type="button"
        data-testid="address-tab"
      >
        {t('advancedEditor.tabs.address.label')}
      </TabButton>
      <TabButton
        $selected={tab === 'other'}
        $hasError={!!getFieldState('other', formState).error}
        $isDirty={getFieldState('other').isDirty}
        onClick={handleTabClick('other')}
        type="button"
        data-testid="other-tab"
      >
        {t('advancedEditor.tabs.other.label')}
      </TabButton>
    </TabButtonsContainer>
  )
}

export default AdvancedEditorTabs
