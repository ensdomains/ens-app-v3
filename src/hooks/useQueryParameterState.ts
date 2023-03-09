import { useRouter } from 'next/router'
import { useState } from 'react'

const getInitialValue = <T extends string | number>(queryValue: string, defaultValue: T): T => {
  if (typeof defaultValue === 'number') return (parseInt(queryValue) as T) || defaultValue
  return (queryValue as T) || defaultValue
}

export const useQueryParameterState = <T extends string | number>(
  parameter: string,
  defaultValue: T,
): [T, (value: T) => void] => {
  const router = useRouter()
  const [state, _setState] = useState<T>(
    getInitialValue(router.query[parameter] as string, defaultValue),
  )
  const setState = (value: T) => {
    const visibleSearchParams = new URLSearchParams(window.location.search)
    const url = new URL(router.asPath, window.location.href)
    const visibleUrl = new URL(router.asPath, window.location.href)

    for (const [key, queryVal] of Object.entries(router.query)) {
      // eslint-disable-next-line no-continue
      if (key === parameter) continue
      url.searchParams.set(key, queryVal as string)
      if (visibleSearchParams.has(key)) {
        visibleUrl.searchParams.set(key, queryVal as string)
      }
    }

    if (value && value !== defaultValue) {
      url.searchParams.set(parameter, value.toString())
      visibleUrl.searchParams.set(parameter, value.toString())
    }

    router.replace(url.toString(), visibleUrl.toString(), { shallow: true })
    _setState(value)
  }
  return [state, setState]
}
