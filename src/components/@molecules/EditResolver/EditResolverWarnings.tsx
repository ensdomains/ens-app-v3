import { Spacer } from '@app/components/@atoms/Spacer'
import { ErrorContainer } from '@app/components/@molecules/ErrorContainer'
import useResolverEditor from '@app/hooks/useResolverEditor'

type Props = Pick<ReturnType<typeof useResolverEditor>, 'hasWarnings' | 'resolverWarnings'>

const EditResolverWarnings = ({ hasWarnings, resolverWarnings }: Props) => {
  if (!hasWarnings) return null

  return (
    <>
      <ErrorContainer
        message={
          <ul>
            {resolverWarnings?.map((message) => (
              <li key={message}>- {message}</li>
            ))}
          </ul>
        }
        type="warning"
      />
      <Spacer $height="4" />
    </>
  )
}

export default EditResolverWarnings
