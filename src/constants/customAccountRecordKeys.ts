/**
 * Custom Account Records Configuration
 *
 * This file contains all configuration for custom account record types (like POAP).
 * It serves as a model for how social accounts could be refactored in the future,
 * with all data consolidated in one location.
 */

import { type SocialIconType } from '@app/assets/social/DynamicSocialIcon'
import { normaliseTwitterRecordValue } from '@app/utils/records/normaliseTwitterRecordValue'

/* eslint-disable @typescript-eslint/naming-convention */

/**
 * Configuration object for a custom account record type
 */
export type CustomAccountConfig<K extends string = string> = {
  key: K
  icon: SocialIconType
  color?: string
  label: string
  type: 'link' | 'copy'
  getUrl?: (value: string) => string
  getValue?: (value: string) => string
}

/**
 * Registry of all custom account record configurations.
 * This is the single source of truth - ensures every key has exactly one config.
 *
 * To add a new custom account:
 * 1. Add a new property to this registry object
 * 2. Register the icon in src/assets/social/DynamicSocialIcon.tsx
 * 3. Create the corresponding SVG file
 */
const customAccountRegistry = {
  'xyz.poap': {
    key: 'xyz.poap',
    icon: 'xyz.poap',
    color: '#6534FF',
    label: 'POAP',
    type: 'link',
    getUrl: (value) => `https://collectors.poap.xyz/scan/${value}`,
  },
  'xyz.farcaster': {
    key: 'xyz.farcaster',
    icon: 'xyz.farcaster',
    color: '#6A3CFF',
    label: 'Farcaster',
    type: 'link',
    getUrl: (value) => `https://farcaster.xyz/${value}`,
  },
  'co.zora': {
    key: 'co.zora',
    icon: 'co.zora',
    label: 'Zora',
    type: 'link',
    getValue: normaliseTwitterRecordValue,
    getUrl: (value) => `https://zora.co/@${value}`,
  },
} as const satisfies Record<string, CustomAccountConfig>

/**
 * TypeScript type for custom account record keys.
 * Derived directly from the registry to ensure consistency.
 */
export type CustomAccountRecordKey = keyof typeof customAccountRegistry

/**
 * Array of custom account record keys.
 * Derived from the registry - do not modify directly.
 */
export const customAccountRecordKeys = Object.keys(
  customAccountRegistry,
) as CustomAccountRecordKey[]

/**
 * Array of custom account configurations.
 * Derived from the registry - do not modify directly.
 */
export const customAccountRecords: ReadonlyArray<CustomAccountConfig<CustomAccountRecordKey>> =
  Object.values(customAccountRegistry)

/**
 * Map for O(1) config lookups
 */
const customAccountConfigMap = new Map(customAccountRecords.map((config) => [config.key, config]))

/**
 * Check if a key is a custom account record key
 */
export function isCustomAccountKey(key: string): key is CustomAccountRecordKey {
  return customAccountConfigMap.has(key as CustomAccountRecordKey)
}

/**
 * Get display data for a custom account
 */
export function getCustomAccountData(key: string, value: string) {
  const config = customAccountConfigMap.get(key as CustomAccountRecordKey)
  if (!config) return null

  return {
    icon: config.icon,
    color: config.color,
    label: config.label,
    value: config.getValue ? config.getValue(value) : value,
    type: config.type,
    urlFormatter: config.getUrl?.(value),
  }
}
