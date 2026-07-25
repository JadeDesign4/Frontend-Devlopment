# MiniPay UI v7 — Optimisation & Upgrade Roadmap

> This document is a standalone specification for the next major version of the MiniPay UI. It is written so that you (or any other contributor / AI) can pick it up and build v7 without needing to re-derive the requirements from the v6 codebase.

---

## 1. Overview & Goals

v7 should move MiniPay from a polished prototype into a production-grade, mobile-first crypto wallet. The priorities are:

1. **Mobile-native experience** — bottom-sheet navigation, gestures, haptics, and a bottom tab bar.
2. **Real crypto primitives** — on-chain balances, real exchange rates, token swaps, and a multi-chain architecture.
3. **Security by default** — biometric/PIN gate, encrypted local storage, transaction signing, and social recovery.
4. **Resilience** — offline-first architecture, background sync, and PWA installability.
5. **Developer ergonomics** — typed code, reusable components, design tokens, and clear state management.

---

## 2. Design System & UX Upgrades

### 2.1 Tokens & Theme
- Expand CSS variables into a full design-token file: colors, spacing, typography, radii, shadows, z-index, timing.
- Add semantic tokens: `--surface-elevated`, `--surface-hover`, `--risk`, `--success`, `--info`, `--warning`.
- Support system dark mode, manual toggle, and per-page theme overrides.
- Add a **high-contrast accessibility mode**.

### 2.2 Navigation
- Replace the top nav with a **bottom tab bar** on mobile (Home, Wallet, Swap, Earn, More).
- Keep a collapsible top header on desktop/tablet.
- Use **route-level transitions** (slide/fade) for page changes.

### 2.3 Mobile Patterns
- Convert modals into **bottom sheets** on mobile.
- Add **pull-to-refresh** on balance and transaction lists.
- Add **swipe actions** on transactions (quick re-send, hide, copy tx hash).
- Provide **haptic feedback** on success, error, and toggle actions.

### 2.4 Empty & Loading States
- Skeleton screens for balance, portfolio, and transactions.
- Empty states with contextual CTAs.
- Loading shimmer that respects the theme.

---

## 3. Core Wallet Upgrades

### 3.1 Multi-Account & Multi-Currency
- Support **multiple wallets** (HD derivation) with optional naming and emoji avatars.
- Store **fiat currency preference** (USD, NGN, EUR, GBP, etc.) with real-time rates.
- Display **localised currency formatting** using `Intl.NumberFormat`.

### 3.2 Balances & Portfolio
- Break the single fiat balance into a **portfolio view**: tokens, stables, fiat, and rewards.
- Add a **chart library** (e.g., lightweight-charts or Chart.js) for historical balance and per-token price charts.
- Show **live prices** and **24h percentage changes** for each asset.

### 3.3 Transactions
- Paginated or virtual-scrolled transaction list.
- Advanced filters: type, date range, amount range, asset, status, and search.
- Transaction detail bottom sheet with:
  - tx hash / explorer link,
  - sender/recipient addresses,
  - gas/network fees,
  - status (pending / confirmed / failed),
  - export as PDF/CSV.
- Export transaction history for accounting.

### 3.4 Send & Receive
- **Address book** with contacts, nicknames, and avatars.
- **QR scanner** using the device camera (`getUserMedia` + a QR library such as `qr-scanner`).
- **Request payment** flow: generate a payment link/QR with fixed amount and memo.
- **Memo/note** field on every send.
- Contact-less NFC/share-sheet integration where available.

---

## 4. Crypto & DeFi Features

### 4.1 Multi-Chain Support
- Maintain a **network selector** with chain metadata (Celo, Ethereum, Base, Arbitrum, etc.).
- Store per-network RPC endpoints and currency symbols.
- Show correct **gas tokens** and **native balances** per chain.

### 4.2 Token Swaps
- Integrate a swap aggregator API (e.g., 0x, Li.Fi, or a DEX router).
- Show price impact, slippage settings, and estimated gas.
- Add a **quote expiration** countdown and refresh button.
- Store recent swap pairs.

### 4.3 On-Ramp / Off-Ramp
- Add a **Buy crypto** flow with fiat on-ramp providers (MoonPay, Transak, Onramper, etc.).
- Add a **Sell / Withdraw** flow to bank or mobile money.
- Display provider fees and KYC requirements upfront.

### 4.4 Earn & Staking
- Discover staking/yield opportunities (CELO, cUSD, etc.).
- Show APY, lock-up period, risk level, and total staked.
- Allow one-tap **stake**, **unstake**, and **claim rewards**.
- Add a **rewards dashboard** with accrued earnings and history.

### 4.5 NFT & Collectibles (Optional)
- Add an NFT tab/gallery showing owned NFTs per chain.
- Display metadata, images, and send/receive actions.

---

## 5. Security & Compliance

### 5.1 Authentication
- **Biometric lock** (fingerprint / face) on app launch and sensitive actions.
- **PIN fallback** with rate limiting and progressive lockouts.
- Optional auto-lock after a user-defined idle time.

### 5.2 Key Management
- Encrypted seed phrase backup with password + cloud backup option (iCloud/Google Drive) using user-controlled encryption.
- Social recovery (shamir secret sharing) or multi-sig options for power users.
- Show a **security score** and prompt users to complete backup.

### 5.3 Transaction Safety
- Require confirmation for sends, swaps, and withdrawals.
- Address book verification and **anti-phishing warnings** for unknown addresses.
- Transaction simulation before signing (where the network supports it).
- Optional spending limits and daily thresholds.

### 5.4 Compliance
- Soft KYC flows for large on/off-ramp transactions.
- Sanctions-screening address checks before sending.
- Localised terms and privacy policy.

---

## 6. Performance, Offline & PWA

### 6.1 Offline-First
- Use a local-first state layer (e.g., IndexedDB + a sync engine) for balances, transactions, and contacts.
- Queue writes (sends, swaps) when offline and retry when connected.
- Cache exchange rates and gas prices with TTL.

### 6.2 PWA
- Add a `manifest.json` and service worker.
- Provide app icons, splash screens, and theme-aware background colors.
- Handle push notifications via a backend or wallet events.

### 6.3 Performance Budget
- Bundle < 250 KB gzipped for the initial route.
- Lazy-load heavy modules (charts, QR scanner, swap widget).
- Use virtual scrolling for long transaction lists.

---

## 7. Architecture & Tech Stack Recommendations

### 7.1 Framework
- Migrate from vanilla HTML/CSS/JS to a component-based framework.
  - Recommended: **React + TypeScript + Vite** or **Vue 3 + TypeScript**.
- Keep the build output as static files so it can be deployed on any static host.

### 7.2 State Management
- Use a small, typed store (Zustand, Pinia, or Redux Toolkit) for:
  - wallet & accounts,
  - balances & transactions,
  - settings & theme,
  - pending operations.

### 7.3 Blockchain Interaction
- Use **viem** or **ethers.js v6** for chain interactions.
- Use **Wagmi** or **RainbowKit** if you want wallet-connect flows in the future.
- Keep a chain-config file with RPCs, explorers, and token contracts.

### 7.4 Design System Code
- Build a reusable component library: Button, Input, Card, Modal, BottomSheet, TokenRow, TransactionRow, Chart, QR, Toggle, etc.
- Use CSS-in-JS or a CSS-variables-only system to ensure theme consistency.

### 7.5 Testing
- Add unit tests for pure helpers (currency, validation, formatting).
- Add component tests with Vitest + Testing Library or Playwright.
- Add E2E tests for critical flows: send, swap, receive, backup.

---

## 8. Suggested Implementation Phases

### Phase 1 — Foundation (2–3 weeks)
- Set up Vite + TypeScript + component library.
- Port the v6 design tokens and dark/light theme.
- Implement bottom tab navigation and route transitions.
- Re-create Home, Wallet, Send, Receive, Swap, Earn, More, Card, and Extra pages as components.

### Phase 2 — Core Wallet (2–3 weeks)
- Integrate real chain balances and price feeds.
- Build transaction history with pagination and filters.
- Implement send/receive with address book and QR scanner.
- Add PIN/biometric lock.

### Phase 3 — DeFi & On-Ramp (2–3 weeks)
- Token swap with quote/approval/signing flow.
- On-ramp/off-ramp provider integration.
- Staking/Earn dashboard and actions.
- Multi-chain network selector.

### Phase 4 — Security, Polish & PWA (2 weeks)
- Seed phrase backup and security score.
- Transaction simulation and safety checks.
- PWA manifest, service worker, offline queue.
- Performance audit, accessibility audit, and E2E tests.

---

## 9. Files & Deliverables to Create for v7

| Path | Purpose |
|------|---------|
| `public/manifest.json` | PWA manifest |
| `src/main.tsx` / `src/main.ts` | App entry point |
| `src/router/index.tsx` | Route definitions |
| `src/styles/tokens.css` | Full design-token file |
| `src/components/` | Reusable UI components |
| `src/pages/` | Page-level components (Home, Swap, Earn, etc.) |
| `src/stores/` | State stores |
| `src/lib/chain.ts` | Chain configuration & RPC helpers |
| `src/lib/wallet.ts` | Wallet derivation & signing helpers |
| `src/lib/prices.ts` | Price feed helpers |
| `src/lib/transactions.ts` | Transaction history & filtering |
| `src/hooks/` | Custom React/Vue hooks |
| `tests/` | Unit and E2E tests |
| `README.md` | Setup, build, and deploy instructions |
| `v8-ideas.md` (optional) | Future features such as multi-sig, NFTs, lending, DAO voting |

---

## 10. How to Use This Roadmap

1. **Save this file** inside the v6 folder (`Minipay-ui:v6/v7-roadmap.md`) or copy it into a new `Minipay-ui:v7` project folder.
2. **Create a new repository/branch** for v7. Do not overwrite the v6 reference files (`minipay-Dark-Dashboard.html` / `minpay-Dark-Dashboard.css`).
3. Work through the phases in order, using the recommendations above as the acceptance criteria for each feature.
4. When you are ready for a next iteration, create a similar `v8-ideas.md` file and continue the cycle.

---

*Last updated: 2026-07-08*
