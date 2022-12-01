import { PropsWithChildren } from 'react'

export const RecordField = ({
  label,
  value,
  children,
}: PropsWithChildren<{
  label?: string
  value?: string
}>) => {
  return (
    <div>
      <div>
        <div>{label}</div>
        <div>{value}</div>
      </div>
      <div>{children}</div>
    </div>
  )
}
