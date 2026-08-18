type PrimaryNameLike = {
  name?: string
  beautifiedName?: string
  originalName?: string
  match?: boolean
} | null

export const hasValidPrimaryName = (primary?: PrimaryNameLike) =>
  !!primary?.name && primary.match !== false

export const getPrimaryDisplayName = (primary?: PrimaryNameLike) => {
  if (!primary?.name) return undefined
  if (primary.match === false) return primary.originalName ?? primary.name
  return primary.beautifiedName ?? primary.name
}
