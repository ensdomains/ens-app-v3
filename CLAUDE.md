# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build & Development
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server

### Testing
- `pnpm test` - Run unit tests
- `pnpm test:watch` - Run unit tests in watch mode  
- `pnpm test:coverage` - Run unit tests with coverage
- `pnpm e2e` - Run stateless e2e tests (requires `pnpm denv` first)
- `pnpm e2e:stateful` - Run stateful e2e tests

### Linting & Type Checking
- `pnpm lint` - Run ESLint and Stylelint
- `pnpm lint:types` - Run TypeScript type checking
- `pnpm lint:fix` - Auto-fix linting issues

### Local Development Environment
- `pnpm denv` - Start test environment with Docker
- `pnpm dev:glocal` - Start dev server with local blockchain
- `pnpm tenv` - Start ENS test environment

## Architecture Overview

### Core Technologies
- **Next.js 13** - React framework with app router
- **TypeScript** - Type safety with path mapping (@app/*, @public/*)
- **Styled Components** - CSS-in-JS styling
- **Tanstack Query** - Data fetching and caching
- **Viem** - Ethereum interaction library
- **wagmi** - React hooks for Ethereum

### Key Architectural Patterns

#### Transaction Flow System
The app uses a sophisticated transaction flow system centered around:
- `TransactionFlowProvider` - Global transaction state management
- `TransactionDialogManager` - Modal-based transaction UI
- `TransactionStore` - Persistent transaction tracking
- Flow types: input → intro → transaction → completed

#### Data Management
- **useQuery wrapper** - Custom hook wrapping Tanstack Query with enhanced loading states
- **ENS.js integration** - Primary blockchain interaction layer
- **Subgraph queries** - GraphQL data from The Graph protocol
- **Local storage persistence** - Transaction and user data persistence

#### Component Architecture
- `@atoms/` - Reusable UI components (buttons, inputs, etc.)
- `@molecules/` - Composite components (search, dialogs, etc.)
- `pages/` - Route components (keep minimal, delegate to components)
- `components/pages/` - Page-specific components organized by route

### Key Directories

#### `/src/hooks/`
- `ensjs/` - ENS blockchain interaction hooks
- `transactions/` - Transaction management hooks
- `abilities/` - Permission and capability hooks
- Domain-specific hooks organized by feature

#### `/src/transaction-flow/`
- `input/` - Form components for transaction flows
- `intro/` - Information screens before transactions
- `transaction/` - Transaction definition files
- `TransactionFlowProvider.tsx` - Core transaction orchestration

#### `/src/utils/`
- `query/` - React Query utilities and providers
- `analytics/` - Event tracking and monitoring
- `validation/` - Form and data validation utilities

### ENS-Specific Concepts

#### Name Types
- **Legacy names** - Original ENS names (not ERC-1155)
- **Wrapped names** - ERC-1155 compatible names via NameWrapper
- **Subnames** - Third-level domains (subdomain.name.eth)

#### Key Functionality
- **Name registration** - Multi-step process with commitment/reveal
- **Profile management** - Records, avatar, social links
- **Name wrapping** - Converting legacy to wrapped names
- **Subname management** - Creating and managing subdomains
- **DNS import** - Importing traditional DNS names

## Development Guidelines

### Testing Strategy
- **Unit tests** - Pure functions and hooks (Vitest)
- **Integration tests** - User interaction flows (Playwright)
- **makeName helper** - E2E test utility for creating unique test names
- Test philosophy: User-centric testing focusing on real user interactions

### Code Patterns
- Use `ts-pattern` for complex conditional logic
- Prefer small, pure functions outside of React hooks
- Transaction logic should be in `transaction/` files, not components
- Use path aliases: `@app/` for src/, `@public/` for public/

### Local Development
1. Install Docker for test environment
2. Use test mnemonic: `test test test test test test test test test test test junk`
3. Connect MetaMask to localhost:8545 for local blockchain testing
4. Run `pnpm denv` then `pnpm dev:glocal` for full local development

## Important Notes

- **Never use `any` type** - Strict TypeScript enforcement
- **Transaction flows** follow input → intro → transaction → completed pattern
- **makeName function** critical for E2E tests - creates unique test names
- **Subgraph sync** may lag behind blockchain - account for eventual consistency
- **Path aliases** configured in tsconfig.json for clean imports