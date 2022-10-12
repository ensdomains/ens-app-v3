import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dropdown, Typography } from '@ensdomains/thorin'

import FastForwardSVG from '@app/assets/FastForward.svg'
import PaperPlaneSVG from '@app/assets/PaperPlane.svg'
import TripleDot from '@app/assets/TripleDot.svg'
import { Card } from '@app/components//Card'
import { cacheableComponentStyles } from '@app/components/@atoms/CacheableComponent'
import { DisabledButton } from '@app/components/@atoms/DisabledButton'
import { NFTWithPlaceholder } from '@app/components/NFTWithPlaceholder'
import { OutlinedButton } from '@app/components/OutlinedButton'
import { useAvatar } from '@app/hooks/useAvatar'
import { useProfileActions } from '@app/hooks/useProfileActions'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { formatExpiry, isDNSName } from '@app/utils/utils'

import { FavouriteButton } from './FavouriteButton'

const Container = styled(Card)(
  ({ theme }) => css`
    padding: ${theme.space['3']};
    width: ${theme.space.full};
    align-items: stretch;
    gap: ${theme.space['3']};
  `,
  cacheableComponentStyles,
)

const ImageWrapper = styled.div(
  ({ theme }) => css`
    border-radius: ${theme.radii.extraLarge};
    width: 35vw;
    height: 35vw;
    max-width: 170px;
    max-height: 170px;
  `,
)

const RightColumn = styled.div(
  ({ theme }) => css`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-self: flex-end;
    justify-content: flex-end;
    height: ${theme.space.full};
    gap: ${theme.space['1']};
  `,
)

const ExpiresHeading = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.textTertiary};
  `,
)

const ExpiryAndFavouriteRow = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${theme.space['1']};
  `,
)

const RowWithGap = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${theme.space['1']};
  `,
)

const InnerButton = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};
  `,
)

const ButtonIcon = styled.svg(
  ({ theme }) => css`
    display: block;
    width: ${theme.space['4']};
    height: ${theme.space['4']};
  `,
)

const SendButtonContainer = styled.div(
  () => css`
    flex: 1;
    > div {
      width: 100%;
    }
  `,
)

const handleSend =
  (showDataInput: ReturnType<typeof useTransactionFlow>['showDataInput'], name: string) => () => {
    showDataInput(`send-name-${name}`, 'SendName', {
      name,
    })
  }

const DropdownWrapper = styled.div(
  ({ theme }) => css`
    /* stylelint-disable */
    & > div > div {
      min-width: ${theme.space['48']};

      button {
        height: ${theme.space['10']};
      }
    }
    /* stylelint-enable */
  `,
)

const TripleDotIcon = styled.div(
  ({ theme }) => css`
    display: block;
    box-sizing: border-box;
    width: ${theme.space['4']};
    height: ${theme.space['4']};
  `,
)

const DisabledButtonWrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space['10']};
  `,
)

export const NameSnippetMobile = ({
  name,
  network,
  expiryDate,
  canSend,
  canEdit,
  canExtend,
  isCached,
}: {
  name: string
  network: number
  expiryDate?: Date | null
  canSend?: boolean
  canEdit?: boolean
  canExtend?: boolean
  isCached?: boolean
}) => {
  const { t } = useTranslation('common')
  const breakpoints = useBreakpoint()
  const { avatar } = useAvatar(name, network)

  const { showDataInput } = useTransactionFlow()
  const handleExtend = () => {
    showDataInput(`extend-names-${name}`, 'ExtendNames', { names: [name], isSelf: canEdit })
  }

  const { profileActions: actions } = useProfileActions()
  const hasActions = actions && actions.length > 0

  if (isDNSName(name)) return null

  return (
    <Container $isCached={isCached}>
      {avatar && (
        <ImageWrapper>
          <NFTWithPlaceholder name={name} network={network} />
        </ImageWrapper>
      )}
      <RightColumn>
        <ExpiryAndFavouriteRow>
          {expiryDate ? (
            <div>
              <ExpiresHeading variant="label">{t('name.expires')}</ExpiresHeading>
              <Typography
                variant="small"
                weight="bold"
                data-testid="expiry-label"
                data-timestamp={expiryDate.getTime()}
              >
                {formatExpiry(expiryDate)}
              </Typography>
            </div>
          ) : (
            <Typography>{t('name.noExpiry')}</Typography>
          )}
          <FavouriteButton disabled />
        </ExpiryAndFavouriteRow>
        {expiryDate && (
          <OutlinedButton
            size="small"
            shadowless
            variant="transparent"
            data-testid="extend-button"
            disabled={!canExtend}
            onClick={handleExtend}
          >
            <InnerButton>
              {breakpoints.xs && <ButtonIcon as={FastForwardSVG} />}
              <Typography weight="bold">{t('name.extend')}</Typography>
            </InnerButton>
          </OutlinedButton>
        )}
        {canSend && (
          <RowWithGap>
            <SendButtonContainer>
              <OutlinedButton
                size="small"
                shadowless
                variant="transparent"
                data-testid="send-button"
                onClick={handleSend(showDataInput, name)}
              >
                <InnerButton>
                  {breakpoints.xs && <ButtonIcon as={PaperPlaneSVG} />}
                  <Typography weight="bold">{t('name.send')}</Typography>
                </InnerButton>
              </OutlinedButton>
            </SendButtonContainer>
            {hasActions ? (
              <DropdownWrapper>
                <Dropdown
                  items={actions.map((action) => ({
                    ...action,
                    color: action.color || 'text',
                  }))}
                  menuLabelAlign="flex-end"
                  align="right"
                  shortThrow
                >
                  <Button
                    data-testid="profile-actions"
                    shadowless
                    variant="transparent"
                    size="extraSmall"
                  >
                    <TripleDotIcon as={TripleDot} />
                  </Button>
                </Dropdown>
              </DropdownWrapper>
            ) : (
              <DisabledButtonWrapper>
                <DisabledButton shadowless variant="transparent" size="extraSmall">
                  <TripleDotIcon as={TripleDot} />
                </DisabledButton>
              </DisabledButtonWrapper>
            )}
          </RowWithGap>
        )}
      </RightColumn>
    </Container>
  )
}
