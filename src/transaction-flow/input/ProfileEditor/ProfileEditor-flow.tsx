import { Banner } from '@app/components/@atoms/Banner/Banner'
import AddRecord from '@app/components/@molecules/ProfileEditor/AddRecord'
import AvatarButton from '@app/components/@molecules/ProfileEditor/Avatar/AvatarButton'
import { AvatarViewManager } from '@app/components/@molecules/ProfileEditor/Avatar/AvatarViewManager'
import ProfileTabContents from '@app/components/@molecules/ProfileEditor/ProfileTabContents'
import ProfileEditorTabs from '@app/components/@molecules/ProfileEditor/ProfileTabs'
import { useProfile } from '@app/hooks/useProfile'
import useProfileEditor from '@app/hooks/useProfileEditor'
import { makeIntroItem } from '@app/transaction-flow/intro'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import type { TransactionDialogPassthrough } from '@app/transaction-flow/types'
import { RecordOptions } from '@ensdomains/ensjs/utils/recordHelpers'
import { Button, mq } from '@ensdomains/thorin'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

const Container = styled.form(({ theme }) => [
  css`
    width: calc(100% + 2 * ${theme.space['3.5']});
    height: calc(100% + 2 * ${theme.space['3.5']});
    max-height: 90vh;
    margin: -${theme.space[3.5]};
    background: ${theme.colors.white};
    border-radius: ${theme.space['5']};
    overflow: hidden;
    display: flex;
    flex-direction: column;
  `,
  mq.sm.min`
    width: 95vw;
    max-width: 600px;
  `,
])

const AvatarWrapper = styled.div(
  () => css`
    position: absolute;
    left: 24px;
    bottom: 0;
    height: 90px;
    width: 90px;
    transform: translateY(50%);
  `,
)

const NameContainer = styled.div(({ theme }) => [
  css`
    flex: 0 0 45px;
    display: block;
    height: 45px;
    width: 100%;
    padding-left: 134px;
    padding-right: ${theme.space['8']};
    letter-spacing: ${theme.letterSpacings['-0.01']};
    line-height: 45px;
    vertical-align: middle;
    text-align: right;
    font-feature-settings: 'ss01' on, 'ss03' on, 'ss04' on;
    font-weight: ${theme.fontWeights.bold};
    font-size: 1.25rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  `,
])

const ContentContainer = styled.div(
  ({ theme }) => css`
    flex: 1;
    display: flex;
    gap: ${theme.space['4']};
    margin-top: ${theme.space['4.5']};
    flex-direction: column;
    overflow: hidden;
    z-index: 1;
  `,
)

const FooterContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    gap: ${theme.space['3']};
    padding: 0 ${theme.space['4']} ${theme.space['4']} ${theme.space['4']};
    width: 100%;
    max-width: ${theme.space['96']};
    margin: 0 auto;
  `,
)

type Data = {
  name?: string
  resumable?: boolean
}

export type Props = {
  name?: string
  data?: Data
  onDismiss?: () => void
} & TransactionDialogPassthrough

const ProfileEditor = ({ data = {}, dispatch, onDismiss }: Props) => {
  const { t } = useTranslation('transactionFlow')

  const { name = '', resumable = false } = data

  const { profile, loading } = useProfile(name, name !== '')

  const handleCancel = () => {
    if (onDismiss) onDismiss()
  }

  const handleCreateTransaction = useCallback(
    async (records: RecordOptions) => {
      if (!profile?.resolverAddress || !resolverAddress) return

      if (!profile?.resolverAddress) return
      if (profile.resolverAddress === resolverAddress) {
        dispatch({
          name: 'setTransactions',
          payload: [
            makeTransactionItem('updateProfile', {
              name,
              resolver: profile.resolverAddress,
              records,
            }),
          ],
        })
        dispatch({ name: 'setFlowStage', payload: 'transaction' })
        return
      }

      dispatch({
        name: 'startFlow',
        key: `edit-profile-flow-${name}`,
        payload: {
          intro: {
            title: 'Action Required',
            content: makeIntroItem('MigrateAndUpdateResolver', { name }),
          },
          transactions: [
            makeTransactionItem('migrateProfileWithSync', {
              name,
              records,
            }),
            makeTransactionItem('updateResolver', {
              name,
              resolver: resolverAddress,
              oldResolver: profile!.resolverAddress!,
              contract: 'registry',
            }),
          ],
          resumable: true,
        },
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [profile, status, resolverAddress],
  )

  const profileEditorForm = useProfileEditor({ callback: handleCreateTransaction, profile })
  const { setValue, handleSubmit, hasErrors, avatar, _avatar, hasChanges } = profileEditorForm

  const [currentContent, setCurrentContent] = useState<'profile' | 'avatar'>('profile')
  const [avatarDisplay, setAvatarDisplay] = useState<string | null>(null)

  const [showOverlay, setShowOverlay] = useState(false)
  useEffect(() => {
    if ((!statusLoading && !status?.hasLatestResolver) || resumable) {
      setShowOverlay(true)
    }
  }, [status, statusLoading, resumable])

  if (profileLoading || statusLoading) return <TransactionLoader />
  return (
    <>
      {' '}
      {currentContent === 'avatar' ? (
        <AvatarViewManager
          name={name}
          avatar={_avatar}
          handleCancel={() => setCurrentContent('profile')}
          handleSubmit={(display: string, uri?: string) => {
            if (uri) {
              setValue('avatar', uri)
              setAvatarDisplay(display)
            } else {
              setValue('avatar', display)
            }
            setCurrentContent('profile')
          }}
        />
      ) : (
        <Container data-testid="profile-editor" onSubmit={handleSubmit}>
          <Banner zIndex={10}>
            <AvatarWrapper>
              <AvatarButton
                validated={avatar !== undefined}
                src={avatarDisplay || avatar}
                onSelectOption={() => setCurrentContent('avatar')}
                setValue={setValue}
                setDisplay={setAvatarDisplay}
              />
            </AvatarWrapper>
          </Banner>
          <NameContainer>{name}</NameContainer>
          <ContentContainer>
            <ProfileEditorTabs {...profileEditorForm} />
            <ProfileTabContents {...profileEditorForm} />
            <AddRecord {...profileEditorForm} />
            <FooterContainer>
              <Button variant="secondary" tone="grey" shadowless onClick={handleCancel}>
                {t('action.cancel', { ns: 'common' })}
              </Button>
              <Button
                disabled={hasErrors || !hasChanges}
                type="submit"
                shadowless
                data-testid="profile-editor-submit"
              >
                {t('action.save', { ns: 'common' })}
              </Button>
            </FooterContainer>
          </ContentContainer>
          {showOverlay && (
            <ResolverWarningOverlay
              name={name}
              hasOldRegistry={!profile?.isMigrated}
              resumable={resumable}
              hasNoResolver={!status?.hasResolver}
              hasMigratedProfile={status?.hasMigratedProfile}
              latestResolver={resolverAddress!}
              oldResolver={profile?.resolverAddress!}
              dispatch={dispatch}
              onDismiss={() => setShowOverlay(false)}
            />
          )}{' '}
        </Container>
      )}
    </>
  )
}

export default ProfileEditor
