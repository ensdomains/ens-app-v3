import { Splide, SplideSlide } from '@splidejs/react-splide'
import { ReactNode } from 'react'

export const Carousel = ({ children }: { children: ReactNode[] }) => {
  return (
    <Splide
      options={{
        arrows: false,
        pagination: false,
        gap: '16px',
        perPage: 1,
        fixedWidth: 312,
      }}
    >
      {children.map((child, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <SplideSlide key={i}>{child}</SplideSlide>
      ))}
    </Splide>
  )
}
