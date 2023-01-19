import { Banner } from '@ensdomains/thorin'

import { Spacer } from '@app/components/@atoms/Spacer'
import useResolverEditor from '@app/hooks/useResolverEditor'

type Props = Pick<ReturnType<typeof useResolverEditor>, 'hasWarnings' | 'resolverWarnings'>

const EditResolverWarnings = ({ hasWarnings, resolverWarnings }: Props) => {
  if (!hasWarnings) return null

  return (
    <>
      <Banner alert="warning">
        <ul>
          {resolverWarnings?.map((message) => (
            <li key={message}>- {message}</li>
          ))}
        </ul>
      </Banner>
      <Spacer $height="4" />
    </>
  )
}

export default EditResolverWarnings
