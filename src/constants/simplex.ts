// SNRC SimpleX link encoding config (issue #11).

// A simplex.contact / simplex.channel text record holds an ordered list of SMP
// server URLs encoded as a single string joined by this separator. It MUST stay
// in lockstep with the SNRC REST resolver's split helper
// (simplexmq/scripts/resolver/snrc-resolve.py).
export const SIMPLEX_LINK_SEPARATOR = ';'

// Max links per category shown/editable in the UI. Pinned to 1 until multi-link
// is supported across the whole stack (dApp ↔ resolver ↔ smp-server). Set back
// to 5 to re-enable multi-link once that's true — no other change is required.
export const SIMPLEX_MAX_LINKS = 1
