# Safe-ENS MetaMask Integration Testing

This document describes the MetaMask extension testing setup for Safe-ENS integration using dappwright.

## Overview

We've implemented a comprehensive testing framework that uses real MetaMask extension in automated browsers to test Safe-ENS integration scenarios. This replaces the headless wallet approach with actual browser extension automation.

## Architecture

### Key Components

1. **Dappwright Integration** (`@tenkeylabs/dappwright`)

   - Handles MetaMask extension download and setup
   - Provides wallet automation methods (approve, reject, switchNetwork)
   - Manages browser context with extension loaded

2. **Configuration System** (`e2e/config/safe-ens-config.ts`)

   - Centralized configuration management
   - Environment variable integration
   - Network-specific settings

3. **Test Implementation** (`e2e/specs/stateful/safe-ens-dappwright.spec.ts`)
   - Complete Safe-ENS integration test suite
   - Robust error handling and multiple selector fallbacks
   - Real browser automation with MetaMask

## Setup

### Prerequisites

```bash
# Install dependencies
pnpm add -D @tenkeylabs/dappwright playwright-core

# Install Playwright browsers
npx playwright install chromium
npx playwright-core install chromium
```

### Environment Configuration

Configure your `.env` file:

```bash
# Wallet Configuration (optional - will use test defaults if not provided)
SECRET_WORDS="your twelve word mnemonic phrase here"
PASSWORD="YourMetaMaskPassword"

# Network Configuration
NETWORK="sepolia"  # Will be overridden to sepolia for tests

# Safe Configuration (optional)
SAFE_URL="https://app.safe.global"
ENS_APP_URL="http://localhost:3000"  # For local development
```

## How It Works

### 1. MetaMask Setup

```typescript
const [metaMask, page, browserContext] = await dappwright.bootstrap('chromium', {
  wallet: 'metamask',
  version: '12.23.0', // Recommended stable version
  seed: 'test test test test test test test test test test test junk',
  password: 'TestMetaMask',
  headless: false, // Required for extensions
  slowMo: 100,
})

// Switch to Sepolia network
await metaMask.switchNetwork('sepolia')
```

### 2. Safe Connection

The test automatically:

- Navigates to Safe welcome page
- Tries multiple selectors to find connect button
- Selects MetaMask from wallet options
- Handles MetaMask approval popup

### 3. ENS App Integration

- Adds ENS app as custom Safe app
- Opens the ENS app within Safe iframe
- Tests basic interactions like name search

## Running Tests

### Basic Test Run

```bash
# Run the Safe-ENS integration test
npx playwright test --project=stateful safe-ens-dappwright.spec.ts --headed
```

### Development Mode

```bash
# Run with slower execution for debugging
DEBUG_BROWSER=1 npx playwright test --project=stateful safe-ens-dappwright.spec.ts --headed --debug
```

### Configuration Options

The test uses configuration from `e2e/config/safe-ens-config.ts`:

```typescript
export const SafeEnsConfig = {
  NETWORK: 'sepolia', // Fixed for testing
  METAMASK: {
    VERSION: '12.23.0', // Stable dappwright-recommended version
    SETUP_TIMEOUT: 30000,
    TRANSACTION_TIMEOUT: 60000,
  },
  BROWSER: {
    HEADLESS: false, // Extensions require headed mode
    SLOW_MO: 100,
    TIMEOUT: 120000,
  },
}
```
