import { ens_beautify, ens_emoji, ens_normalize_fragment, ens_split, ens_tokenize, is_combining_mark, should_escape, type DisallowedToken, type EmojiToken, type IgnoredToken, type Label, type MappedToken, type NFCToken, type StopToken, type TextToken, type Token, type ValidToken } from '@adraffy/ens-normalize';
export declare const normalise: (name: string) => string;
export declare function namehash(name: string): `0x${string}`;
export declare const beautify: typeof ens_beautify;
export declare const emoji: typeof ens_emoji;
export declare const normaliseFragment: typeof ens_normalize_fragment;
export declare const split: typeof ens_split;
export declare const tokenise: typeof ens_tokenize;
export declare const isCombiningMark: typeof is_combining_mark;
export declare const shouldEscape: typeof should_escape;
export type { DisallowedToken, EmojiToken, IgnoredToken, Label, MappedToken, NFCToken, StopToken, TextToken, Token, ValidToken, };
//# sourceMappingURL=normalise.d.ts.map