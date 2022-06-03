import styled from 'styled-components'

import ResolverDetails from './ResolverDetails'
import Fuses from './Fuses'
import Accordion, { AccordionData } from './Accordion'

const data: AccordionData = [
  {
    title: 'Resolver',
    body: <ResolverDetails />,
  },
  {
    title: 'Fuses',
    body: <Fuses />,
  },
  {
    title: 'Token ID',
    body: <div>body 3</div>,
  },
  {
    title: 'Registration Date',
    body: <div>body 3</div>,
  },
]

const MoreContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const More = () => {
  return (
    <MoreContainer>
      <Accordion data={data} />
    </MoreContainer>
  )
}

export default More
