import styled from 'styled-components'

import Accordion, { AccordionData } from './Accordion'

const data: AccordionData = [
  {
    title: 'title1',
    body: <div>body 1</div>,
  },
  {
    title: 'title2',
    body: <div>body 2</div>,
  },
  {
    title: 'title3',
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
