# pnpm 10 Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Update project configuration to work correctly with pnpm 10.23.0 after upgrading from pnpm 9.3.0.

**Architecture:** Add `onlyBuiltDependencies` to allow lifecycle scripts for essential packages, update `.npmrc` to restore hoisting for linting tools, then verify all project commands work correctly.

**Tech Stack:** pnpm 10, Node.js, Next.js 13, ESLint, Stylelint, Prettier, Vitest, Playwright

---

## Background

pnpm 10 introduced breaking changes:
1. **Lifecycle scripts disabled by default** - Dependencies' postinstall scripts don't run unless explicitly allowed
2. **Nothing hoisted by default** - ESLint/Prettier plugins no longer auto-hoisted to root node_modules
3. **Lockfile hashing changed** - SHA256 instead of MD5 for long paths

---

### Task 1: Add onlyBuiltDependencies to package.json

**Files:**
- Modify: `package.json:195-304` (inside the `pnpm` section)

**Step 1: Add onlyBuiltDependencies array**

In `package.json`, add `onlyBuiltDependencies` as the first key inside the `pnpm` object (before `overrides`):

```json
"pnpm": {
  "onlyBuiltDependencies": [
    "esbuild",
    "fsevents",
    "husky"
  ],
  "overrides": {
```

This allows:
- `esbuild` - Native binary compilation (used by Vite/Vitest)
- `fsevents` - macOS file watching (used by Next.js/Vite)
- `husky` - Git hooks setup (your postinstall runs `husky install`)

**Step 2: Verify JSON is valid**

Run: `node -e "require('./package.json')"`
Expected: No output (valid JSON)

**Step 3: Commit**

```bash
git add package.json
git commit -m "chore: add pnpm onlyBuiltDependencies for pnpm 10 compatibility"
```

---

### Task 2: Update .npmrc for linting tool hoisting

**Files:**
- Modify: `.npmrc`

**Step 1: Add public-hoist-pattern entries**

Append to `.npmrc`:

```
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*prettier*
public-hoist-pattern[]=*stylelint*
```

Full file should now be:

```
strict-peer-dependencies=false
auto-install-peers=false
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*prettier*
public-hoist-pattern[]=*stylelint*
```

**Step 2: Commit**

```bash
git add .npmrc
git commit -m "chore: restore hoisting for linting tools in pnpm 10"
```

---

### Task 3: Reinstall dependencies

**Files:**
- Regenerates: `node_modules/`, `pnpm-lock.yaml`

**Step 1: Clean and reinstall**

Run: `rm -rf node_modules && pnpm install`

Expected output should include:
- Lifecycle scripts running for `husky`, `esbuild`, `fsevents`
- No errors about missing peer dependencies
- Successful completion

**Step 2: Verify husky installed**

Run: `ls -la .husky/_/`
Expected: `husky.sh` file exists (proves postinstall ran)

**Step 3: Commit lockfile changes (if any)**

```bash
git add pnpm-lock.yaml
git commit -m "chore: update lockfile for pnpm 10"
```

---

### Task 4: Verify linting works

**Files:**
- None (verification only)

**Step 1: Run ESLint**

Run: `pnpm lint`
Expected: Completes without "Cannot find module" errors for ESLint plugins

**Step 2: Run TypeScript type checking**

Run: `pnpm lint:types`
Expected: Completes (may have type errors unrelated to pnpm - that's ok)

---

### Task 5: Verify tests work

**Files:**
- None (verification only)

**Step 1: Run unit tests**

Run: `pnpm test`
Expected: Vitest runs and tests execute (pass/fail results are separate from pnpm migration)

---

### Task 6: Verify build works

**Files:**
- None (verification only)

**Step 1: Run Next.js build**

Run: `pnpm build`
Expected: Build completes without module resolution errors

---

### Task 7: Verify dev server works

**Files:**
- None (verification only)

**Step 1: Start dev server**

Run: `pnpm dev`
Expected: Next.js dev server starts on http://localhost:3000

**Step 2: Stop dev server**

Press: `Ctrl+C`

---

## Troubleshooting

If any verification step fails with module resolution errors:

1. **"Cannot find module 'X'"** - Add X to `onlyBuiltDependencies` if it has native code, or add hoisting pattern to `.npmrc`
2. **"ENOENT .husky/_/husky.sh"** - Husky postinstall didn't run; verify `husky` is in `onlyBuiltDependencies`
3. **ESLint plugin not found** - Add specific pattern to `.npmrc`: `public-hoist-pattern[]=*plugin-name*`

---

## Rollback

If migration fails and you need to rollback:

```bash
git checkout HEAD -- package.json .npmrc pnpm-lock.yaml
rm -rf node_modules
corepack enable
corepack prepare pnpm@9.3.0 --activate
pnpm install
```
