import { useCallback, useEffect, useState } from 'react'

import { useEns } from '@app/utils/EnsProvider'

import { emptyAddress } from '../utils/constants'

const FETCH_PAGE_SIZE = 50

type Subnames = ReturnType<typeof useEns>['getSubnames']['subnames']

export const useHasSubnames = (name: string) => {
  const { getSubnames, ready } = useEns()

  const isSubname = name && name.split('.').length > 2

  const [hasSubnames, setHasSubnames] = useState(false)
  const [done, setDone] = useState(false)
  const [cursor, setCursor] = useState<Subnames | undefined>()

  const getSubnamesCallback = useCallback(async () => {
    const result = await getSubnames({
      name,
      lastSubnames: cursor,
      orderBy: 'labelName',
      orderDirection: 'desc',
      pageSize: FETCH_PAGE_SIZE,
    })
    const { subnames } = result
    const subnamesHasOwner = result.subnames.some((subname) => subname.owner.id !== emptyAddress)
    const fetchedFullPage = result.subnames.length === FETCH_PAGE_SIZE

    setHasSubnames(subnamesHasOwner)
    setDone(subnamesHasOwner || !fetchedFullPage)
    setCursor(subnames)
  }, [cursor, name, getSubnames])

  useEffect(() => {
    if (ready && !!name && isSubname && !done) getSubnamesCallback()
  }, [getSubnamesCallback, ready, name, isSubname, done])

  return {
    hasSubnames,
    isLoading: isSubname && !done,
  }
}
