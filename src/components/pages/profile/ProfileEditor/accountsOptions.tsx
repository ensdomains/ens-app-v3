import {
  DynamicSocialIcon,
  socialIconTypes,
} from '@app/assets/social/DynamicSocialIcon'
import supportedTexts from '@app/constants/supportedTexts.json'
import styled, { css } from 'styled-components'
import { Select } from '@ensdomains/thorin'
import { ComponentProps } from 'react'
import { getSocialData } from '../../../../utils/getSocialData'
import { formSafeKey } from './utils'

const IconWrapper = styled.div(
  () => css`
    width: 22px;
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
      value: formSafeKey(account),
      label: socialData.label,
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
}, [] as ComponentProps<typeof Select>['options'])

export default accountsOptions
