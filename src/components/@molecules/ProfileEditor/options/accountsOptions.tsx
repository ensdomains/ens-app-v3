import { ComponentProps } from 'react'
import styled, { css } from 'styled-components'

import { Select } from '@ensdomains/thorin'

import { DynamicSocialIcon, socialIconTypes } from '@app/assets/social/DynamicSocialIcon'
import supportedTexts from '@app/constants/supportedSocialRecordKeys.json'
import { formSafeKey } from '@app/utils/editor'
import { getSocialData } from '@app/utils/getSocialData'

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
            name={socialData?.value as keyof typeof socialIconTypes}
            fill={socialData?.icon}
          />
        </IconWrapper>
      ),
    },
  ]
}, [] as ComponentProps<typeof Select>['options'])

export default accountsOptions
