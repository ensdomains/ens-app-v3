import styled, { css } from 'styled-components'

const Container = styled.button<{ $active: boolean }>(
  ({ theme, $active }) => css`
    cursor: pointer;
    flex: 0 0 ${theme.space['9']};
    width: ${theme.space['9']};
    height: ${theme.space['9']};
    color: ${$active ? theme.colors.accent : theme.colors.grey};
    svg {
      path,
      rect {
        transition: all 0.15s ease-in-out;

        stroke-width: 1px;
      }
    }

    &:hover {
      color: ${theme.colors.accent};
      svg {
        path,
        rect {
          stroke-width: 1.5px;
        }
      }
    }
  `,
)

type Props = {
  active?: boolean
  onChange?: (value: boolean) => void
}

export const CheckButton = ({ active = false, onChange }: Props) => {
  return (
    <Container
      type="button"
      $active={active}
      onClick={() => onChange?.(!active)}
      data-testid="check-button"
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="none"
          d="M7 12.3125L11.0625 16.0625L17 7.9375"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          fill="none"
          x="1"
          y="1"
          width="22"
          height="22"
          rx="11"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    </Container>
  )
}
