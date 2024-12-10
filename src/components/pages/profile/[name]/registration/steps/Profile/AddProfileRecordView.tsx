import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Control, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dialog, MagnifyingGlassSimpleSVG, ScrollBox } from '@ensdomains/thorin'

import DismissDialogButton from '@app/components/@atoms/DismissDialogButton/DismissDialogButton'
import { Spacer } from '@app/components/@atoms/Spacer'
import { DialogFooterWithBorder } from '@app/components/@molecules/DialogComponentVariants/DialogFooterWithBorder'
import { DialogInput } from '@app/components/@molecules/DialogComponentVariants/DialogInput'
import {
  grouped as options,
  ProfileRecord,
  ProfileRecordGroup,
} from '@app/constants/profileRecordOptions'
import { ProfileEditorForm } from '@app/hooks/useProfileEditorForm'

import useDebouncedCallback from '../../../../../../../hooks/useDebouncedCallback'
import { OptionButton } from './OptionButton'
import { OptionGroup } from './OptionGroup'

const Content = styled.div(
  ({ theme }) => css`
    display: flex;
    flex: 1;
    width: 100%;
    gap: ${theme.space[6]};
    overflow: hidden;

    @media (min-width: ${theme.breakpoints.sm}px) {
      width: 80vw;
      max-width: ${theme.space['128']};
    }
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

const SideBarItem = styled.button<{
  $active?: boolean
}>(
  ({ theme, $active }) => css`
    font-size: ${theme.space['3.5']};
    font-weight: ${theme.fontWeights.bold};
    line-height: ${theme.space[4]};
    padding: ${theme.space[2]} ${theme.space[2]};
    cursor: pointer;
    color: ${theme.colors.greyPrimary};

    ${$active &&
    css`
      color: ${theme.colors.accentPrimary};
    `}

    &:hover {
      color: ${$active ? theme.colors.accentPrimary : theme.colors.text};
    }

    &:disabled {
      color: ${theme.colors.border};
      cursor: not-allowed;
    }
  `,
)

const OptionsContainer = styled.div(
  () => css`
    position: relative;
    flex: 1;
    overflow: hidden;

    > div {
      height: 100%;
    }
  `,
)

const GroupLabel = styled.div(
  ({ theme }) => css`
    padding: ${theme.space[2]} 0;
    font-weight: ${theme.fontWeights.bold};
    font-size: ${theme.space['3.5']};
    line-height: ${theme.space[5]};
    color: ${theme.colors.greyPrimary};
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

const DismissButtonWrapper = styled.div(
  ({ theme }) => css`
    position: absolute;
    top: ${theme.space[3]};
    right: ${theme.space[3]};
  `,
)

type Props = {
  control: Control<ProfileEditorForm, any>
  onAdd?: (records: ProfileRecord[]) => void
  onClose?: () => void
  showDismiss?: boolean
}

export const AddProfileRecordView = ({ control, onAdd, onClose, showDismiss }: Props) => {
  const { t, i18n } = useTranslation('register')

  const currentRecords = useWatch({ control, name: 'records' })
  const [selectedRecords, setSelectedRecords] = useState<ProfileRecord[]>([])

  const [search, setSearch] = useState('')

  const filteredOptions = useMemo(() => {
    if (!i18n.isInitialized || !search) return options
    const matchSearch = (s: string) => s.toLowerCase().indexOf(search.toLocaleLowerCase()) !== -1
    return options.map((option) => {
      // If search matches group label, return all items
      if (matchSearch(t(`steps.profile.options.groups.${option.group}.label`))) return option
      if (option.group === 'address') {
        const items = option.items.filter(
          (item) => matchSearch(item.key) || matchSearch(item.longName),
        )
        return {
          ...option,
          items,
        }
      }
      const items = option.items.filter((item) => {
        const { key: record, group } = item
        // if website - match the record name, else match the translated record name
        if (group === 'website') return matchSearch(record)
        return matchSearch(t(`steps.profile.options.groups.${option.group}.items.${record}`))
      })
      return {
        ...option,
        items,
      }
    })
  }, [search, t, i18n])

  // Tracks when to skip updating the sidebar while options grid is scrolling
  const shouldSkipObserverUpdateRef = useRef<boolean>()
  const debouncedSetShouldSkipObserverUpdateRef = useDebouncedCallback(
    () => (shouldSkipObserverUpdateRef.current = false),
    1000,
    [],
  )

  const observerRootRef = useRef<HTMLDivElement>(null)
  const generalRef = useRef<HTMLDivElement>(null)
  const socialRef = useRef<HTMLDivElement>(null)
  const addressRef = useRef<HTMLDivElement>(null)
  const websiteRef = useRef<HTMLDivElement>(null)
  const otherRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const sectionRefMap: {
    [key in ProfileRecordGroup]?: React.RefObject<HTMLDivElement>
  } = {
    general: generalRef,
    social: socialRef,
    address: addressRef,
    website: websiteRef,
    other: otherRef,
  }

  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)

  useEffect(() => {
    const intersectingEdges = new Set<string>()
    const intersectingSections = new Set<string>()

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const group = entry.target.getAttribute('data-group')
        const isEdge = ['top', 'bottom'].includes(group as string)

        if (!group) return

        if (isEdge) {
          if (entry.isIntersecting) intersectingEdges.add(group)
          else intersectingEdges.delete(group)
        } else if (entry.isIntersecting) intersectingSections.add(group as string)
        else intersectingSections.delete(group as string)
      })

      if (shouldSkipObserverUpdateRef.current) return

      const firstIntersectingGroup = [...intersectingSections][0]
      const firstOptionWithItems = filteredOptions.find((option) => option.items.length > 0)
      if (intersectingEdges.has('top') && firstOptionWithItems) {
        setSelectedGroup(firstOptionWithItems.group)
      } else if (intersectingEdges.has('bottom') && filteredOptions[filteredOptions.length - 1]) {
        setSelectedGroup('other')
      } else if (firstIntersectingGroup) {
        setSelectedGroup(firstIntersectingGroup as ProfileRecordGroup)
      }
    }

    const observer = new IntersectionObserver(handleObserver, {
      root: observerRootRef.current,
      rootMargin: '-20% 0px -80% 0px',
    })

    const sectionRefMapKeys = Object.keys(sectionRefMap) as ProfileRecordGroup[]
    sectionRefMapKeys.forEach((key: ProfileRecordGroup) => {
      const ref = sectionRefMap[key]
      if (ref?.current) {
        observer?.observe(ref.current)
      }
    })

    const edgesObserver = new IntersectionObserver(handleObserver, {
      root: observerRootRef.current,
    })
    if (bottomRef.current) edgesObserver.observe(bottomRef.current)
    if (topRef.current) edgesObserver.observe(topRef.current)

    return () => {
      observer?.disconnect()
      edgesObserver?.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredOptions])

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
    const ref = sectionRefMap[group as ProfileRecordGroup]
    shouldSkipObserverUpdateRef.current = true
    ref?.current?.scrollIntoView({ behavior: 'smooth' })
    debouncedSetShouldSkipObserverUpdateRef()
  }

  const handleToggleOption = (option: ProfileRecord) => {
    if (selectedRecords.find((record) => record.key === option.key)) {
      setSelectedRecords(selectedRecords.filter((record) => record.key !== option.key))
    } else {
      setSelectedRecords([...selectedRecords, option])
    }
  }

  return (
    <>
      <Dialog.Heading title={t('steps.profile.addProfile')} />
      <DialogInput
        label=""
        hideLabel
        icon={<MagnifyingGlassSimpleSVG />}
        size="medium"
        placeholder={t('action.search', { ns: 'common' })}
        value={search}
        onChange={(e) => {
          setSearch(e.currentTarget.value)
        }}
        data-testid="profile-record-search-input"
      />
      <Content>
        <SideBar>
          {filteredOptions.map((option) => (
            <SideBarItem
              type="button"
              key={option.group}
              $active={selectedGroup === option.group}
              disabled={option.items.length === 0 && option.group !== 'other'}
              onClick={() => handleSelectGroup(option.group)}
            >
              {t(`steps.profile.options.groups.${option.group}.label`)}
            </SideBarItem>
          ))}
        </SideBar>
        <OptionsContainer ref={observerRootRef}>
          <ScrollBox hideDividers>
            <div ref={topRef} style={{ height: '1px' }} data-group="top" />
            <Spacer $height="4" />
            {filteredOptions.map((option) => {
              const showLabel = !['address', 'website'].includes(option.group)
              if (option.items.length === 0 && option.group !== 'other') return null
              return (
                <OptionGroup
                  key={option.group}
                  ref={sectionRefMap[option.group]}
                  data-group={option.group}
                >
                  <GroupLabel id={`option-group-${option.group}`}>
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
            <Spacer $height="4" />
            <div ref={bottomRef} style={{ height: '1px' }} data-group="bottom" />
          </ScrollBox>
        </OptionsContainer>
      </Content>
      <DialogFooterWithBorder
        fullWidth
        leading={
          !showDismiss &&
          onClose && (
            <Button
              data-testid="add-profile-records-close"
              onClick={() => onClose()}
              colorStyle="accentSecondary"
            >
              {t('action.back', { ns: 'common' })}
            </Button>
          )
        }
        trailing={
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
        }
      />
      {onClose && showDismiss && (
        <DismissButtonWrapper>
          <DismissDialogButton data-testid="dismiss-dialog-btn" onClick={onClose} />
        </DismissButtonWrapper>
      )}
    </>
  )
}
