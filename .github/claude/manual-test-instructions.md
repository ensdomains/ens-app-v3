# Claude manual-test run book

You are doing exploratory **manual** testing of a pull request against a fully local ENS stack,
driving a real browser through the Playwright MCP server. You are not writing automated tests.

## Environment (already running — verify, don't rebuild)

| Thing | Where | Notes |
| --- | --- | --- |
| App (Next.js dev server) | http://localhost:3000 | started with `pnpm dev:glocal` |
| Chain (anvil) | http://localhost:8545 | chain id `1337`, started by `pnpm denv` |
| Subgraph (ensnode) | http://localhost:42069/subgraph | lags the chain — always re-sync before asserting on lists |
| Wallet control server | http://127.0.0.1:8546 | starts with your first browser navigation, see below |

Sanity-check by opening http://localhost:3000. If the app or the chain is not up, **stop and report
that** instead of guessing.

### Wallet

Every browser tab gets the same mock wallet the e2e suite uses
(`@ensdomains/headless-web3-provider`, injected by `.github/scripts/manual-test/init-page.cjs`). In
the connect modal it is **"Headless Web3 Provider"** — pick that, exactly as the e2e specs do. Every
request kind is pre-authorized, so there is no extension popup and no "Confirm connection in the
extension" step to wait on: a transaction is signed and submitted the moment the app asks.

The accounts are the standard anvil test accounts (`test test test ... junk`), named `user`,
`user2`, `user3`, `user4` — the same names the e2e suite uses. `user` is active by default.

The control server comes up with the first tab, so navigate once before using it:

```bash
curl -s http://127.0.0.1:8546/state                                          # active account, chain, block time
curl -sXPOST http://127.0.0.1:8546/account      -d '{"user":"user2"}'        # switch account (all tabs)
curl -sXPOST http://127.0.0.1:8546/time/advance -d '{"seconds":7776000}'     # chain + page clock forward 90 days
curl -sXPOST http://127.0.0.1:8546/clock/sync                               # re-pin page clock to chain time
```

### Clock

Local anvil does not run on real time. The page clock is installed at the anvil block timestamp
(same as the `time` e2e fixture), and `/time/advance` moves the chain and the page clock together.
Reload the page after time travel so the app re-reads state. Never reason about expiry using today's
real-world date — use `curl -s http://127.0.0.1:8546/state | jq .blockTimestamp`.

### Creating test data

Do not try to hand-register names through the UI just to get fixtures. Use the seeder, which is the
same `makeName` helper the e2e suite uses:

```bash
SEED_NAMES='[
  {"label":"claude-legacy","type":"legacy","owner":"user"},
  {"label":"claude-wrapped","type":"wrapped","owner":"user","duration":31536000},
  {"label":"claude-grace","type":"legacy","owner":"user","duration":-86400}
]' pnpm seed
```

* `type`: `legacy` (legacy + config), `legacy-register`, or `wrapped`
* negative `duration` puts a name in the grace period; other options (`manager`, `fuses`,
  `records`, `subnames`, `resolver`, `addr`) are documented in `playwright/fixtures/makeName/`
* the seeder appends a unique suffix to each label and prints the real names as
  `SEEDED: [...]` — always use those, not the label you asked for
* prefix your labels (e.g. `claude-…`) so they are recognisable in the report
* it waits for the subgraph before returning, and needs no browser

Read the existing specs in `e2e/specs/stateless/` for realistic usage patterns of any flow you are
about to exercise (they show the actual routes, test ids and expected copy).

**Scope:** if `MANUAL_TEST_SCOPE` is `baseline`, run Phase 0 and the report only — skip Phases 1-3.
That mode is for rehearsing this workflow itself, not for reviewing a PR.

## Phase 0 — Baseline flows (always run, whatever the PR changes)

Every PR gets these two flows exercised end to end, before anything PR-specific. They are the app's
core money paths, they cover the harness itself, and they give a PR with no user-facing change
something meaningful to report.

**1. Register a name**

* connect as `user`, search for a fresh unregistered label (prefix it, e.g. `claude-reg-<something>`)
* run the full flow: duration, payment step, commit, the countdown, then the register transaction
* the commit countdown is chain-time based — if it stalls, advance the chain
  (`curl -sXPOST http://127.0.0.1:8546/time/advance -d '{"seconds":60}'`) and reload
* **oracles**: after completion the name resolves to a profile page; the expiry is the registration
  block timestamp advanced by the duration you chose **as calendar time**, not a fixed number of
  seconds (see the note below); the owner is `user`'s address; the name shows up under My Names once
  the subgraph catches up

**2. Extend a name**

* use an existing owned name — seed one rather than registering a second time:
  `SEED_NAMES='[{"label":"claude-ext-<something>","type":"legacy","owner":"user"}]' pnpm seed`
* note the expiry shown before extending, then extend by 1 year and confirm the transaction
* **oracles**: new expiry = the same calendar date one year after the old expiry (state both
  timestamps in the report); the quoted price is the rent price for that duration, not a
  placeholder; the profile and My Names both show the new expiry after the subgraph syncs

> **Durations are calendar years, not 31,536,000s.** `DateSelection` computes the duration with
> `secondsFromDateDiff` → `setFullYear(year + n)` (`src/utils/date.ts`), so a year spanning Feb 29 is
> 366 days (31,622,400s). Expiry 2027-07-30 → 2028-07-30 crosses the 2028 leap day and is *correctly*
> one day longer than a naive `+31536000`. Derive the expected value by calendar arithmetic and only
> flag a mismatch against that — do not report the leap-day difference as a regression.

Report these as their own section. If either fails, that is a finding regardless of what the PR
touched — say so plainly and continue to the PR-specific work.

## Phase 1 — Understand the change (do NOT skip)

1. Read `gh pr view $PR` (title + body — it often states intended behaviour, edge cases, and
   explicit non-goals) and `gh pr diff $PR`.
2. For each changed file decide: does it have a user-facing runtime surface? Build a list of the
   concrete behaviours a user can observe. Note anything the author calls out of scope — do not
   test that as if it were new.
3. Find the UI entry points for those behaviours by exploring the running app yourself. Verify real
   routes and control selectors; never assume URLs or labels from the PR description.
4. Work out what test data you need (name type, ownership, expiry state, records, fuses,
   wrapped vs unwrapped, subnames) and seed it up front with the seeder above.

## Phase 2 — Derive a test plan

Write a comprehensive scenario list covering:

* the happy path(s) the PR is meant to enable
* edge cases: empty/unset, invalid or malformed input, boundary values, pre-existing/legacy data,
  and whatever the diff's branches and error handling imply
* regression: adjacent features sharing code with this change still work
* state-dependent rendering: if output depends on account / chain time / name state / device,
  VARY that state and confirm the output tracks it

For each scenario state the **oracle** up front — the exact rule that makes it pass or fail. Where
the expected value is computable (a price, a duration, a date, a derived string), compute it
yourself and show the arithmetic. Never judge by "looks plausible".

Post the plan as the first section of your report before executing it.

## Phase 3 — Execute

Drive the app with the Playwright MCP tools. For every scenario:

* navigate, act, and capture evidence (`browser_snapshot`, and `browser_take_screenshot` for
  anything visual or anything that failed)
* wait for transaction modals to reach their final state — transactions auto-approve but still need
  a block; the subgraph then needs a moment to index
* watch the browser console for errors (`browser_console_messages`) and note them
* when something fails, try to isolate it: retry once, vary one input, and check whether it also
  fails on `origin/main` behaviour you can reason about from the diff

Record for each scenario: what you did, expected (with the oracle), actual, PASS/FAIL/BLOCKED.

## Phase 4 — Report

Write the full report to `/tmp/manual-test-report.md` and post it:

```bash
gh pr comment $PR --body-file /tmp/manual-test-report.md
```

**Dry run:** if `MANUAL_TEST_DRY_RUN` is `true` (local `act` runs), do not comment on the PR — write
the file and print the report to stdout instead.

Report structure:

1. **Verdict** — one line: `✅ looks good` / `⚠️ issues found` / `❌ blocked`, plus a one-sentence
   summary and the count of pass/fail/blocked.
2. **What I understood the PR to do** — 3-6 bullets, plus stated non-goals.
3. **Test plan** — the scenarios with their oracles.
4. **Results table** — scenario | expected | actual | verdict.
5. **Issues found** — for each: severity, exact reproduction steps (route, account, seeded data,
   clicks), expected vs actual with the arithmetic where relevant, console errors.
6. **Not covered** — anything you could not test, and why.

Be blunt about failures and equally blunt about uncertainty — mark a scenario BLOCKED rather than
guessing a verdict. Screenshots live in the workflow artifacts; reference them by filename.
