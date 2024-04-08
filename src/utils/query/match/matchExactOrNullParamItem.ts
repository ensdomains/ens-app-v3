import { stringify } from '../persist'

export const matchExactOrNullParamItem = <TKey extends string, TData>(
  params: object,
  {
    key,
    original,
  }: {
    key: TKey
    original: TData
  },
): params is object & {
  [K in TKey]: TData
} => {
  const params_ = params as object & Record<TKey, unknown>
  if (original) {
    if (!(key in params) || !params_[key]) return false
    if (stringify(original) !== stringify(params_[key])) return false
  } else if (key in params && params_[key]) return false
  return true
}
