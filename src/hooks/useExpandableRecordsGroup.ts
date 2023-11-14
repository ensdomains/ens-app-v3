import { ComponentProps, useEffect, useMemo, useState } from 'react'
import { FieldValues, Path, PathValue, UseFormGetValues, UseFormSetValue } from 'react-hook-form'

import { Select } from '@ensdomains/thorin'

type Option = ComponentProps<typeof Select>['options'][number]

interface Props<T extends FieldValues> {
  group: Path<T>
  existingKeys: string[]
  options: Option[]
  getValues: UseFormGetValues<T>
  setValue: UseFormSetValue<T>
  returnAllFields?: boolean
}

const useExpandableRecordsGroup = <T extends FieldValues>({
  group,
  options,
  existingKeys: initialExistingKeys,
  getValues,
  returnAllFields,
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

  const addKey = (key: string) => {
    if ([...existingKeys, ...newKeys].includes(key)) return
    setNewKeys((keys) => [...keys, key])
    setValue(group, { ...getValues(group), [key]: '' })
  }

  const removeKey = (key: Path<Path<T>>, shouldRemove = true) => {
    setExistingKeys((keys) => keys.filter((_key) => _key !== key))
    setNewKeys((keys) => keys.filter((_key) => _key !== key))
    const oldValues = getValues(group) as { [key: string]: string }
    if (!oldValues[key]) return
    const { [key]: _, ...otherValues } = oldValues
    if (shouldRemove) {
      setValue(group, otherValues as PathValue<T, Path<T>>, {
        shouldDirty: returnAllFields ? Object.keys(otherValues).length > 0 : true,
      })
    } else {
      setValue(`${group}.${key}` as Path<T>, '' as PathValue<T, Path<T>>, { shouldDirty: true })
    }
  }

  const getSelectedOption = (key: string) =>
    options.find(({ value }) => value === key) || { label: key, value: key }

  return {
    existingKeys,
    newKeys,
    addKey,
    removeKey,
    hasOptions,
    availableOptions,
    getSelectedOption,
  }
}

export default useExpandableRecordsGroup
