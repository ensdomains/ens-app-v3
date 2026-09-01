# Manual-test harness

Supports `.github/workflows/claude-manual-test.yaml`, which lets Claude drive the real app in a
browser (via the Playwright MCP server) against the local ENS stack and post a report on the PR.

The e2e suite gets its wallet and its clock from Playwright fixtures, which a browser driven through
MCP does not have. `init-page.cjs` restores both by hooking MCP's `--init-page`, which the server
`require()`s and calls as `default({ page })` for every tab, before that tab navigates:

* injects **the same mock wallet the e2e suite uses** (`@ensdomains/headless-web3-provider`) with
  every request kind in `permitted`, so nothing needs manual authorization — it shows up in the
  connect modal as "Headless Web3 Provider", exactly as in `playwright/fixtures/login.ts`
* installs the page clock at the anvil block timestamp, like the `time` fixture — local chain time is
  not real time, so without this every name looks expired
* starts a control server on `127.0.0.1:8546` (with the first tab) so the agent driving the browser
  can switch accounts and travel in time from the shell

Related files:

| File | Role |
| --- | --- |
| `wait-for-stack.mjs` | Blocks until contracts are deployed on chain and the subgraph has caught up. `.env.local` existing is not proof — it survives across runs |
| `smoke.mjs` | Boots a real MCP server with the hook, loads the app, and asserts the wallet, clock and control server all work. Runs before the Claude session so a broken harness fails in seconds instead of mid-session |
| `../claude/manual-test-instructions.md` | The run book Claude follows |
| `../../e2e/seed/seed.spec.ts` | `pnpm seed` — seeds names with the same `makeName` helper as the e2e suite |

Run the smoke test by hand against a running stack with
`node .github/scripts/manual-test/smoke.mjs` (add `MCP_CONFIG=...` to spawn MCP exactly as the
workflow does).

## Running it locally

```bash
pnpm denv         # anvil + subgraph + contracts
pnpm dev:glocal   # app on :3000

# MCP server with the wallet + clock hook
npx -y @playwright/mcp@latest install-browser chrome-for-testing   # once
npx -y @playwright/mcp@latest --init-page "$PWD/.github/scripts/manual-test/init-page.cjs"
```

Control server (available after the first navigation):

```bash
curl -s  http://127.0.0.1:8546/state
curl -sXPOST http://127.0.0.1:8546/account      -d '{"user":"user2"}'
curl -sXPOST http://127.0.0.1:8546/time/advance -d '{"seconds":7776000}'
curl -sXPOST http://127.0.0.1:8546/clock/sync
```

Seeding:

```bash
SEED_NAMES='[{"label":"demo","type":"legacy","owner":"user","duration":-86400}]' pnpm seed
```

## Testing the workflow itself with `act`

```bash
act workflow_dispatch -W .github/workflows/claude-manual-test.yaml --input pr=<number> \
  -P blacksmith-4vcpu-ubuntu-2404=catthehacker/ubuntu:act-latest \
  --container-daemon-socket /var/run/docker.sock \
  --artifact-server-path /tmp/act-artifacts
```

Add `-n` for a dry run (validates the job graph and expressions only). `act` sets `ACT=true`, and the
steps that need real GitHub context — `gh pr checkout`, the Claude session, the failure comment — are
guarded with `if: ${{ !env.ACT }}`, so a local run exercises the stack (deps, browsers, `denv`, the
app, the harness smoke test) and stops short of spending Claude usage.

To rehearse the Claude session itself locally, add a token and opt in:

```bash
act workflow_dispatch -W .github/workflows/claude-manual-test.yaml \
  -P blacksmith-4vcpu-ubuntu-2404=catthehacker/ubuntu:act-latest \
  --container-daemon-socket /var/run/docker.sock \
  --artifact-server-path /tmp/act-artifacts \
  --env CLAUDE_IN_ACT=true \
  --env MANUAL_TEST_SCOPE=baseline \
  -s GITHUB_TOKEN="$(gh auth token)" \
  -s CLAUDE_CODE_OAUTH_TOKEN            # act prompts for the value (from `claude setup-token`)
```

No `--input pr=` here on purpose: with no PR to read, only a baseline rehearsal makes sense, and the
workflow fails fast if you ask for full scope without a PR number. Add `--input pr=<number>` (and
drop `MANUAL_TEST_SCOPE`) once there is a real PR to test.

Get the token with `claude setup-token` — it is not the same as an interactive Claude Code login.
Instead of `-s`, you can put `CLAUDE_CODE_OAUTH_TOKEN=...` in a `.secrets` file (gitignored, act
reads it by default).

Two guards make that safe and cheap:

* `MANUAL_TEST_DRY_RUN` is set automatically under `act`, so the session writes
  `/tmp/manual-test-report.md` and prints it instead of commenting on the real PR
* `MANUAL_TEST_SCOPE=baseline` limits the session to the Phase 0 register/extend flows, which is
  enough to prove auth, MCP, the wallet and the report path work

Env overrides: `ANVIL_RPC_URL` (default `http://localhost:8545`), `MANUAL_TEST_CONTROL_PORT`
(default `8546`), `SECRET_WORDS`, `MANUAL_TEST_WALLET_DEBUG=1` for provider-level logging.

> The wallet signs with the standard anvil test mnemonic and approves everything without prompting.
> It is for local/CI test chains only — never point it at a real RPC.

Note: `init-page.cjs` runs inside the MCP server process, which speaks JSON-RPC over stdout — all
logging in it must go to stderr.
