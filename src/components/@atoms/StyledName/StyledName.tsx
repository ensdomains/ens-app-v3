import { Box, BoxProps } from '@ensdomains/thorin'

import { useBeautifiedName } from '@app/hooks/useBeautifiedName'

type StyledNameProps = { name: string; disabled?: boolean }

export const StyledName = ({ name, disabled = false, ...props }: BoxProps & StyledNameProps) => {
  const beautifiedName = useBeautifiedName(name)
  const [label, ...restName] = beautifiedName.split('.')

  return (
    <Box
      {...props}
      display="flex"
      justifyContent="flex-start"
      fontWeight="bold"
      lineHeight="1.36"
      overflow="hidden"
    >
      <Box
        as="span"
        color={disabled ? '$textSecondary' : '$text'}
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        minWidth="$0"
      >
        {label}
        {restName.length > 0 && (
          <Box as="span" color="$textSecondary">
            .
          </Box>
        )}
      </Box>
      <Box as="span" color="$textSecondary" whiteSpace="nowrap">
        {restName.join('.')}
      </Box>
    </Box>
  )
}
