import { Select } from '@ensdomains/thorin'
import { ComponentProps, useMemo, useState, useEffect } from 'react'
import {
  FieldValues,
  Path,
  PathValue,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form'

type Option = ComponentProps<typeof Select>['options'][number]

interface Props<T extends FieldValues> {
  group: Path<T>
  existingKeys: string[]
  options: Option[]
  getValues: UseFormGetValues<T>
  setValue: UseFormSetValue<T>
}

const useExpandableRecordsGroup = <T>({
  group,
  options,
  existingKeys: initialExistingKeys,
  getValues,
  setValue,
}: Props<T>) => {
  const [existingKeys, setExistingKeys] = useState(initialExistingKeys)
  useEffect(() => {
    setExistingKeys(initialExistingKeys)
  }, [initialExistingKeys])

  const [newKeys, setNewKeys] = useState<string[]>([])

  const availableOptions = useMemo(() => {
    const usedOptions = [...existingKeys, ...newKeys]
    return options.filter(({ value }) => !usedOptions.includes(value))
  }, [existingKeys, newKeys, options])

  const hasOptions = availableOptions.length > 0

  const getOptions = (value: string) => {
    const selectedOption = options.find((option) => option.value === value)
    if (selectedOption) return [selectedOption, ...availableOptions]
    return [{ value, label: value }, ...availableOptions]
  }

  const addKey = (prefix?: string) => {
    const newKey = availableOptions[0]?.value
    if (newKey) {
      setNewKeys((keys) => [...keys, newKey])
      setValue(group, { ...getValues(group), [newKey]: '' })
    } else if (prefix) {
      const currentPrefixIds = [...existingKeys, ...newKeys]
        .filter((option) => option.startsWith(prefix))
        .map((option) => parseInt(option.replace(prefix, '')))
        .filter((id) => !Number.isNaN(id))

      const maxId = Math.max(0, ...currentPrefixIds)
      const newPrefixId = maxId + 1
      const newPrefixKey = `${prefix}${newPrefixId}`
      setNewKeys((keys) => [...keys, newPrefixKey])
      setValue(group, { ...getValues(group), [newPrefixKey]: '' })
    }
  }

  const changeKey = (oldKey: Path<Path<T>>, newKey: Path<Path<T>>) => {
    if (oldKey === newKey) return
    const { [oldKey]: oldValue, ...otherRecords } = getValues(group)
    const newGroupRecords = {
      ...otherRecords,
      [newKey]: oldValue || '',
    } as PathValue<T, Path<T>>
    setValue(group, newGroupRecords)
    setExistingKeys((keys) => keys.filter((key) => key !== oldKey))
    setNewKeys((keys) => [...keys, newKey].filter((_key) => _key !== oldKey))
  }

  const removeKey = (key: Path<Path<T>>) => {
    setExistingKeys((keys) => keys.filter((_key) => _key !== key))
    setNewKeys((keys) => keys.filter((_key) => _key !== key))
    const oldValues = getValues(group)
    const { [key]: _, ...newValues } = oldValues
    setValue(group, newValues as PathValue<T, Path<T>>)
  }

  return {
    existingKeys,
    newKeys,
    addKey,
    removeKey,
    changeKey,
    hasOptions,
    getOptions,
  }
}

export default useExpandableRecordsGroup
