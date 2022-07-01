import {
  DynamicSocialIcon,
  socialIconTypes,
} from '@app/assets/social/DynamicSocialIcon'
import supportedTexts from '@app/constants/supportedTexts.json'
import styled, { css } from 'styled-components'
import { getSocialData } from '../../../../utils/getSocialData'

const IconWrapper = styled.div(
  () => css`
    width: 22px;
    margin-right: -8px;
    margin-left: -8px;
    display: flex;
    align-items: center;
  `,
)

const accountsOptions = supportedTexts.reduce((list, account) => {
  const socialData = getSocialData(account, '')
  if (!socialData) return list
  return [
    ...list,
    {
      value: account,
      label: socialData.icon,
      prefix: (
        <IconWrapper>
          <DynamicSocialIcon
            name={socialData?.icon as keyof typeof socialIconTypes}
            fill={socialData?.color}
          />
        </IconWrapper>
      ),
    },
  ]
}, [] as { label: string; value: string; prefix: React.ReactNode }[])

export default accountsOptions
