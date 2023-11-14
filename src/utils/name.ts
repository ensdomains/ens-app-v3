import { P, match } from 'ts-pattern'

export const nameParts = (name: string) => {
  const parts = name.split('.')
  return {
    label: parts[0],
    parent: parts.slice(1).join('.'),
  }
}

export const nameLevel = (name: string) => {
  const parts = name.split('.')
  return match(parts.length)
    .with(2, () => '2ld' as const)
    .with(
      P.when((n: number) => n > 2),
      () => 'subname' as const,
    )
    .otherwise(() => (name === '[root]' ? ('root' as const) : ('tld' as const)))
}

export const parentName = (name: string) => {
  if (!name) return ''
  const parts = name.split('.').slice(1)
  return parts.length ? parts.join('.') : '[root]'
}
