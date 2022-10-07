export function toUnicode(domain: string, options?: { useStd3ASCII: boolean }): string;
export function toAscii(domain: string, options?: { transitional: boolean, useStd3ASCII: boolean, verifyDnsLength: boolean }): string;

export function convert(domains: string): { IDN: string; PC: string; }
export function convert(domains: string[]): { IDN: string[]; PC: string[]; }
export function convert(domains: string | string[]): { IDN: string | string[]; PC: string | string[]; };