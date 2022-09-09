import { useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { RecordOptions } from '@ensdomains/ensjs/utils/recordHelpers'
import { Button, Dialog, DownIndicatorSVG, Helper, Tag, Typography, mq } from '@ensdomains/thorin'

import { Banner } from '@app/components/@atoms/Banner/Banner'
import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import AddRecord from '@app/components/@molecules/ProfileEditor/AddRecord'
import { AvatarViewManager } from '@app/components/@molecules/ProfileEditor/Avatar/AvatarViewManager'
import AvatarButton from '@app/components/@molecules/ProfileEditor/AvatarButton'
import ProfileTabContents from '@app/components/@molecules/ProfileEditor/ProfileTabContents'
import ProfileEditorTabs from '@app/components/@molecules/ProfileEditor/ProfileTabs'
import { useNameDetails } from '@app/hooks/useNameDetails'
import useProfileEditor from '@app/hooks/useProfileEditor'

const StyledCard = styled.form(
  ({ theme }) => css`
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.02);
    border-radius: ${theme.radii['2xLarge']};
    background-color: ${theme.colors.background};
    overflow: hidden;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `,
)

const AvatarWrapper = styled.div(
  ({ theme }) => css`
    position: absolute;
    bottom: 0;
    height: ${theme.space['24']};
    width: ${theme.space.full};
    transform: translate(calc(50% - ${theme.space['12']}), 50%);
    & > div {
      height: ${theme.space['24']};
      width: ${theme.space['24']};
    }
  `,
)

const ContentContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    display: flex;
    flex-direction: column;
    gap: ${theme.space['6']};
    margin-top: ${theme.space['18']};
    padding: ${theme.space['4']};
    padding-top: 0;
    overflow-y: visible;
    position: static;

    & > div:first-of-type {
      align-items: center;
      justify-content: flex-start;
      padding: 0;
      padding-bottom: ${theme.space['2']};
      border-bottom: 1px solid ${theme.colors.grey};
    }

    ${mq.md.min(css`
      padding: ${theme.space['6']} ${theme.space['18']};
      & > div:first-of-type {
        justify-content: center;
        margin: 0 6px;
      }
    `)}
  `,
)

const AdvancedOptions = styled.div(
  ({ theme }) => css`
    --border-style: 1px solid ${theme.colors.grey};
    display: flex;
    flex-direction: column;
    border: var(--border-style);
    border-radius: ${theme.radii.large};
    overflow: hidden;
  `,
)

const AdvancedOptionsContent = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    padding: 0 ${theme.space['4']};
  `,
)

const AdvancedOptionItem = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.space['4']} 0;
    &:not(:last-of-type) {
      border-bottom: var(--border-style);
    }
  `,
)

const AdvancedOptionTrailing = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: ${theme.space['2']};
  `,
)

const AdvancedOptionsButton = styled.button(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    border-bottom: var(--border-style);
    padding: ${theme.space['4']};
    margin-bottom: -${theme.space.px};

    svg {
      width: ${theme.space['3']};
    }
  `,
)

const ButtonContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
  `,
)

type Props = {
  nameDetails: ReturnType<typeof useNameDetails>
}

const Profile = ({ nameDetails }: Props) => {
  const { address } = useAccount()

  const { normalisedName: name } = nameDetails

  const profile = useMemo(
    () => ({
      isMigrated: true,
      createdAt: `${Date.now()}`,
      records: {
        coinTypes: [
          {
            type: 'addr' as const,
            key: '60',
            coin: 'ETH',
            addr: address,
            value: '',
          },
        ],
      },
    }),
    [address],
  )

  const callback = (data: RecordOptions) => {
    console.log(data)
  }

  const profileEditorForm = useProfileEditor({ callback, profile })
  const { avatar, setValue, _avatar, formState, hasErrors, hasChanges } = profileEditorForm

  console.log(formState)

  const trailingButton = useMemo(() => {
    if (hasChanges) {
      return (
        <Button shadowless disabled={hasErrors} type="submit">
          Next
        </Button>
      )
    }
    return (
      <Button shadowless variant="secondary" onClick={() => console.log('skip')}>
        Skip
      </Button>
    )
  }, [hasChanges, hasErrors])

  const [avatarModalOpen, setAvatarModalOpen] = useState(false)
  const [avatarDisplay, setAvatarDisplay] = useState<string | null>(null)
  const [advancedOpen, setAdvancedOpen] = useState(false)

  return (
    <>
      <Dialog variant="blank" open={avatarModalOpen}>
        <AvatarViewManager
          name={name}
          avatar={_avatar}
          handleCancel={() => setAvatarModalOpen(false)}
          handleSubmit={(display: string, uri?: string) => {
            if (uri) {
              setValue('avatar', uri)
              setAvatarDisplay(display)
            } else {
              setValue('avatar', display)
            }
            setAvatarModalOpen(false)
          }}
        />
      </Dialog>
      <StyledCard>
        <Banner>
          <AvatarWrapper>
            <AvatarButton
              validated={avatar !== undefined}
              src={avatarDisplay || avatar}
              onSelectOption={() => setAvatarModalOpen(true)}
              setValue={setValue}
              setDisplay={setAvatarDisplay}
            />
          </AvatarWrapper>
        </Banner>
        <ContentContainer>
          <ProfileEditorTabs {...profileEditorForm} />
          <ProfileTabContents removePadding {...profileEditorForm} />
          <AddRecord {...profileEditorForm} />
          <Helper type="info">
            Your profile information will be stored on the blockchain. Anything you add will be
            publicly visible.
          </Helper>
          <AdvancedOptions>
            <AdvancedOptionsButton
              onClick={(e) => {
                e.preventDefault()
                setAdvancedOpen((prev) => !prev)
              }}
            >
              <Typography>Advanced</Typography>
              <DownIndicatorSVG />
            </AdvancedOptionsButton>
            {advancedOpen && (
              <AdvancedOptionsContent>
                <AdvancedOptionItem>
                  <Typography>Permissions</Typography>
                  <AdvancedOptionTrailing>
                    <Tag tone="green">Default</Tag>
                    <Button size="small" shadowless>
                      Edit
                    </Button>
                  </AdvancedOptionTrailing>
                </AdvancedOptionItem>
                <AdvancedOptionItem>
                  <Typography>Resolver</Typography>
                  <AdvancedOptionTrailing>
                    <Tag tone="green">Default</Tag>
                    <Button size="small" shadowless>
                      Edit
                    </Button>
                  </AdvancedOptionTrailing>
                </AdvancedOptionItem>
                <AdvancedOptionItem>
                  <Typography>Records</Typography>
                  <AdvancedOptionTrailing>
                    <Button size="small" shadowless>
                      Edit
                    </Button>
                  </AdvancedOptionTrailing>
                </AdvancedOptionItem>
              </AdvancedOptionsContent>
            )}
          </AdvancedOptions>
          <ButtonContainer>
            <MobileFullWidth>
              <Button shadowless variant="secondary">
                Back
              </Button>
            </MobileFullWidth>
            <MobileFullWidth>{trailingButton}</MobileFullWidth>
          </ButtonContainer>
        </ContentContainer>
      </StyledCard>
    </>
  )
}

export default Profile
