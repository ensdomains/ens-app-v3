import { Splide, SplideSlide } from '@splidejs/react-splide'
import { ReactNode } from 'react'

export const Carousel = ({ children }: { children: ReactNode[] }) => {
  return (
    <Splide
      options={{
        arrows: false,
        pagination: false,
        gap: '16px',
        perPage: 2,
        fixedWidth: 312,
      }}
    >
      {children.map((child) => (
        <SplideSlide>{child}</SplideSlide>
      ))}
    </Splide>
  )
}
