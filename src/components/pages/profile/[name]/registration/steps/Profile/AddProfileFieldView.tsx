import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dialog, Input, ScrollBox, SearchSVG } from '@ensdomains/thorin'

import addressItems from '@app/constants/supportedAddresses.json'
import websiteKeys from '@app/constants/supportedContentHashKeys.json'
import generalItems from '@app/constants/supportedGeneralRecordKeys.json'
import otherItems from '@app/constants/supportedOtherRecordKeys.json'
import socialItems from '@app/constants/supportedSocialRecordKeys.json'

import useDebouncedCallback from '../../../../../../../hooks/useDebouncedCallback'
import { OptionButton } from './OptionButton'
import { OptionGroup } from './OptionGroup'

const options = [
  { group: 'general', items: generalItems },
  { group: 'social', items: socialItems },
  { group: 'address', items: addressItems },
  { group: 'website', items: websiteKeys },
  { group: 'other', items: otherItems },
]

const Container = styled.div(
  () => css`
    display: flex;
    flex-direction: column;
    width: 100%;
  `,
)

const Content = styled.div(
  ({ theme }) => css`
    display: flex;
    flex: 1;
    width: 100%;
    gap: ${theme.space[6]};
    overflow: hidden;
    max-height: calc(100vh - 17rem);
  `,
)

const SideBar = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: ${theme.space[4]} 0;
  `,
)

const SideBarItem = styled.button(
  ({ theme }) => css`
    font-size: ${theme.space['3.5']};
    line-height: ${theme.space[4]};
    padding: ${theme.space[2]} ${theme.space[2]};
  `,
)

const OptionsContainer = styled.div(
  ({ theme }) => css`
    position: relative;
    flex: 1;
    overflow: hidden;

    > div {
      height: 100%;
      padding-right: ${theme.space[1]};
      padding-top: ${theme.space[4]};
      padding-bottom: ${theme.space[4]};
    }
  `,
)

const GroupLabel = styled.div(
  ({ theme }) => css`
    padding: ${theme.space[2]} 0;
    font-weight: ${theme.fontWeights.bold};
    font-size: ${theme.space['3.5']};
    line-height: ${theme.space[5]};
    color: ${theme.colors.textTertiary};
  `,
)
const OptionsGrid = styled.div(
  ({ theme }) => css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(${theme.space['28']}, 1fr));
    column-gap: ${theme.space[2]};
    row-gap: ${theme.space[2]};
  `,
)

const NoResultsMessage = styled.div(
  ({ theme }) => css`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    padding: ${theme.space[4]};
  `,
)

const FooterWrapper = styled.div(
  ({ theme }) => css`
    border-top: 1px solid ${theme.colors.borderTertiary};
    padding-top: ${theme.space[4]};
    margin: 0 -${theme.space['3.5']};
  `,
)

export const AddProfileFieldView = () => {
  const { t, i18n } = useTranslation('register')
  const [search, setSearch] = useState('')
  const [debouncedSearch, _setDebouncedSearch] = useState('')
  const setDebouncedSearch = useDebouncedCallback(
    (value: string) => _setDebouncedSearch(value),
    300,
  )

  const visibleOptions = useMemo(() => {
    if (!i18n.isInitialized) return options
    return options
      .map((option) => {
        const items = option.items.filter((item) => {
          if (item.toLowerCase().indexOf(debouncedSearch.toLocaleLowerCase()) !== -1) return true
          if (['address', 'website'].includes(option.group)) return false
          const label = t(`steps.profile.options.groups.${option.group}.items.${item}`)
          return label.toLowerCase().indexOf(debouncedSearch.toLocaleLowerCase()) !== -1
        })
        return items.length > 0 ? { ...option, items } : null
      })
      .filter((option) => !!option) as typeof options
  }, [debouncedSearch, t, i18n])

  const scrollToRef = useRef<HTMLDivElement>(null)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)

  const handleSelectGroup = (group: string) => {
    setSelectedGroup(group)
    process.nextTick(() => {
      scrollToRef.current?.scrollIntoView({ behavior: 'smooth' })
    })
  }

  return (
    <Container>
      <Input
        label=""
        hideLabel
        prefix={<SearchSVG />}
        size="medium"
        placeholder={t('action.search', { ns: 'common' })}
        value={search}
        onChange={(e) => {
          setSearch(e.currentTarget.value)
          setDebouncedSearch(e.currentTarget.value)
        }}
        parentStyles={css`
          height: 48px;
        `}
      />
      <Content>
        <SideBar>
          {visibleOptions.map((option) => (
            <SideBarItem
              type="button"
              key={option.group}
              onClick={() => handleSelectGroup(option.group)}
            >
              {t(`steps.profile.options.groups.${option.group}.label`)}
            </SideBarItem>
          ))}
        </SideBar>
        <OptionsContainer>
          {visibleOptions.length > 0 ? (
            <ScrollBox>
              {visibleOptions.map((option) => {
                if (!option) return null
                const displayKey = ['address', 'website'].includes(option.group)
                return (
                  <OptionGroup
                    key={option.group}
                    ref={selectedGroup === option.group ? scrollToRef : null}
                  >
                    <GroupLabel>
                      {t(`steps.profile.options.groups.${option.group}.label`)}
                    </GroupLabel>
                    <OptionsGrid>
                      {option.items.map((item) => (
                        <OptionButton
                          group={option.group}
                          key={item}
                          item={item}
                          label={
                            displayKey
                              ? undefined
                              : t(`steps.profile.options.groups.${option.group}.items.${item}`)
                          }
                          selected
                        />
                      ))}
                    </OptionsGrid>
                  </OptionGroup>
                )
              })}
            </ScrollBox>
          ) : (
            <NoResultsMessage>{t('errors.noResults', { ns: 'common' })}</NoResultsMessage>
          )}
        </OptionsContainer>
      </Content>
      <FooterWrapper>
        <Dialog.Footer
          trailing={
            <Button
              variant="primary"
              size="medium"
              onClick={() => {}}
              shadowless
              suffix={<div>3</div>}
            >
              {t('action.add', { ns: 'common' })}
            </Button>
          }
        />
      </FooterWrapper>
    </Container>
  )
}
