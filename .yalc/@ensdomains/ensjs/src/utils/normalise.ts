import uts46 from 'idna-uts46-hx/uts46bundle.js'

export const normalise = (name: string) =>
  name ? uts46.toUnicode(name, { useStd3ASCII: true }) : name
