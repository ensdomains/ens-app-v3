import { SIMPLEX_LINK_SEPARATOR } from '@app/constants/simplex'

/**
 * Decode a `simplex.contact` / `simplex.channel` text-record value into an
 * ordered list of SMP server URLs. The on-chain record stores the list as a
 * single string joined by `SIMPLEX_LINK_SEPARATOR` (`;`); clients try the URLs
 * in order, primary first. Whitespace around separators is trimmed and empty
 * entries are dropped so trailing separators, doubled separators, and
 * all-whitespace inputs all yield clean output.
 *
 * Mirrors the split helper in the SNRC REST resolver
 * (`simplexmq/scripts/resolver/snrc-resolve.py`). The two sides MUST stay
 * in lockstep for round-trips through the dApp ↔ resolver ↔ smp-server
 * chain to be lossless.
 */
export const parseSimplexUrls = (value: string | undefined): string[] => {
  if (!value) return []
  return value
    .split(SIMPLEX_LINK_SEPARATOR)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
}
