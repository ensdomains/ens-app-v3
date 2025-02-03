export const CUSTOMIZED_TLDS = ['club'] as const
export type CustomizedTLD = (typeof CUSTOMIZED_TLDS)[number]
