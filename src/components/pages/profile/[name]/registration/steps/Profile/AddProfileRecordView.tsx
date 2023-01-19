import { useCallback, useMemo, useRef, useState } from 'react'
import { Control, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dialog, Input, MagnifyingGlassSimpleSVG, ScrollBox } from '@ensdomains/thorin'

import { Spacer } from '@app/components/@atoms/Spacer'
import { ProfileRecord, grouped as options } from '@app/constants/profileRecordOptions'
import useDebouncedCallback from '@app/hooks/useDebouncedCallback'
import { RegistrationForm } from '@app/hooks/useRegistrationForm'
import mq from '@app/mediaQuery'

import { DeleteButton } from './DeleteButton'
import { OptionButton } from './OptionButton'
import { OptionGroup } from './OptionGroup'

const Container = styled.div(() => [
  css`
    display: flex;
    flex-direction: column;
    width: 100%;
  `,
  mq.sm.min(css`
    width: 520px;
  `),
])

const ButtonWrapper = styled.div(
  () => css`
    position: absolute;
    top: 0;
    right: 0;
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
    padding: ${theme.space[5]} 0;
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

const NoResultsContainer = styled.div(
  () => css`
    display: flex;
    flex-direction: column;
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
    border-top: 1px solid ${theme.colors.border};
    padding: ${theme.space[4]};
    padding-bottom: 0;
    margin: 0 -${theme.space['3.5']};
  `,
)

type Props = {
  control: Control<RegistrationForm, any>
  onAdd?: (records: ProfileRecord[]) => void
  onClose?: () => void
}

export const AddProfileRecordView = ({ control, onAdd, onClose }: Props) => {
  const { t, i18n } = useTranslation('register')

  const currentRecords = useWatch({ control, name: 'records' })
  const [selectedRecords, setSelectedRecords] = useState<ProfileRecord[]>([])

  const [search, setSearch] = useState('')
  const [debouncedSearch, _setDebouncedSearch] = useState('')
  const setDebouncedSearch = useDebouncedCallback(
    (value: string) => _setDebouncedSearch(value),
    300,
  )

  const visibleOptions = useMemo(() => {
    if (!i18n.isInitialized || !debouncedSearch) return options
    return options
      .map((option) => {
        const items = option.items.filter((item) => {
          const { key: record } = item
          if (record.toLowerCase().indexOf(debouncedSearch.toLocaleLowerCase()) !== -1) return true
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

  const isOptionSelected = (option: ProfileRecord) => {
    return !!selectedRecords.find((record) => record.key === option.key)
  }

  const isOptionDisabled = useCallback(
    (option: ProfileRecord) => {
      const isContentHashPredicate = (o: ProfileRecord): boolean =>
        o.group === 'website' || o.key === 'contentHash'
      const currentContentHash = currentRecords.find(isContentHashPredicate)
      const selectedContentHash = selectedRecords.find(isContentHashPredicate)
      if (isContentHashPredicate(option)) {
        if (currentContentHash) return true
        if (selectedContentHash && selectedContentHash.key !== option.key) return true
        return false
      }
      return !!currentRecords.find((record) => record.key === option.key)
    },
    [currentRecords, selectedRecords],
  )

  const handleSelectGroup = (group: string) => {
    setSelectedGroup(group)
    process.nextTick(() => {
      scrollToRef.current?.scrollIntoView({ behavior: 'smooth' })
    })
  }

  const handleToggleOption = (option: ProfileRecord) => {
    if (selectedRecords.find((record) => record.key === option.key)) {
      setSelectedRecords(selectedRecords.filter((record) => record.key !== option.key))
    } else {
      setSelectedRecords([...selectedRecords, option])
    }
  }

  return (
    <Container>
      <ButtonWrapper>
        <DeleteButton size="large" onClick={() => onClose?.()} />
      </ButtonWrapper>
      <Dialog.Heading title={t('steps.profile.addProfile')} />
      <Spacer $height="6" />
      <Input
        label=""
        hideLabel
        icon={<MagnifyingGlassSimpleSVG />}
        size="medium"
        placeholder={t('action.search', { ns: 'common' })}
        value={search}
        onChange={(e) => {
          setSearch(e.currentTarget.value)
          setDebouncedSearch(e.currentTarget.value)
        }}
        data-testid="profile-record-search-input"
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
            <ScrollBox hideDividers>
              {visibleOptions.map((option) => {
                const showLabel = !['address', 'website'].includes(option.group)

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
                          data-testid={`profile-record-option-${item.key}`}
                          group={option.group}
                          key={item.key}
                          item={item.key}
                          {...(showLabel
                            ? {
                                label: t(
                                  `steps.profile.options.groups.${option.group}.items.${item.key}`,
                                ),
                              }
                            : {})}
                          selected={isOptionSelected(item)}
                          disabled={isOptionDisabled(item)}
                          onClick={() => handleToggleOption(item)}
                        />
                      ))}
                      {option.group === 'other' && (
                        <OptionButton
                          group="custom"
                          key="custom"
                          item="custom"
                          label={t(`steps.profile.options.groups.other.items.custom`)}
                          selected={!!selectedRecords.find((r) => r.group === 'custom')}
                          onClick={() =>
                            handleToggleOption({ group: 'custom', key: '', type: 'text' })
                          }
                          data-testid="profile-record-option-custom"
                        />
                      )}
                    </OptionsGrid>
                  </OptionGroup>
                )
              })}
            </ScrollBox>
          ) : (
            <NoResultsContainer>
              <NoResultsMessage>{t('steps.profile.errors.noOptionResults')}</NoResultsMessage>
              <OptionsGrid>
                <OptionButton
                  group="custom"
                  key="custom"
                  item="custom"
                  label={t(`steps.profile.options.groups.other.items.custom`)}
                  selected={!!selectedRecords.find((r) => r.group === 'custom')}
                  onClick={() => handleToggleOption({ group: 'custom', key: '', type: 'text' })}
                  data-testid="profile-record-option-custom"
                />
              </OptionsGrid>
            </NoResultsContainer>
          )}
        </OptionsContainer>
      </Content>
      <FooterWrapper>
        <Button
          size="medium"
          onClick={() => onAdd?.(selectedRecords)}
          count={selectedRecords.length}
          fullWidthContent
          disabled={selectedRecords.length === 0}
          data-testid="add-profile-records-button"
        >
          {t('action.add', { ns: 'common' })}
        </Button>
      </FooterWrapper>
    </Container>
  )
}
