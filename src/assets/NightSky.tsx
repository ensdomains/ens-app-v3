import { ReactNode, useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'

const Container = styled.div(
  ({ theme }) => css`
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: ${theme.radii['2xLarge']};
    & > * {
      position: relative;
      z-index: 1;
      background: transparent !important;
    }
    canvas {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
    }
  `,
)

export const NightSky = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, '#1B418B')
    gradient.addColorStop(1, '#090754')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    const starCount = 100
    for (let i = 0; i < starCount; i += 1) {
      const x = Math.floor(Math.random() * canvas.width)
      const y = Math.floor(Math.random() * canvas.height)
      ctx.beginPath()
      ctx.arc(x, y, 1, 0, Math.PI * 2, false)
      ctx.fillStyle = '#fff'
      ctx.globalAlpha =
        Math.random() *
          ((x * y * 1.5) / (ctx.canvas.width * ctx.canvas.height)) +
        0.2
      ctx.fill()
    }
  }, [])

  return (
    <Container>
      {children}
      <canvas ref={ref} />
    </Container>
  )
}
