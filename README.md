# WealthCurator AI - Personal Finance Dashboard

Production-quality AI-powered personal finance dashboard built with React, Vite, and Tailwind CSS.

## Project Overview

WealthCurator AI is a modular fintech dashboard designed to demonstrate production frontend engineering fundamentals:

- Scalable architecture and feature-based organization
- Reusable custom hooks and UI primitives
- Robust loading/error/empty state handling
- Dynamic AI insight generation from financial data
- Analytics-ready event instrumentation (GA4 compatible)
- Performance optimization via code splitting and memoization
- SEO and accessibility-first implementation patterns

## Tech Stack

- React 19
- Vite 5
- Tailwind CSS 3
- Recharts
- ESLint

## Implemented Capabilities

### 1) Core Dashboard Experience

- Sticky header with search
- Sidebar navigation
- Main sections:
  - Summary
  - AI Insights
  - Transactions

### 2) Summary Cards

- Net Worth, Monthly Spending, Monthly Savings
- Async data loading simulation
- Loading, error, and empty states

### 3) Transactions + Analytics Views

- Transaction table with semantic structure
- Income/Expense filtering
- Cashflow bar chart
- Spending breakdown pie chart
- Empty states for filtered/no-chart-data scenarios

### 4) AI Insights Engine (Dynamic, Not Hardcoded)

Insights are computed from summary and transaction datasets, including:

- Cashflow signal (income vs expenses)
- Top expense concentration by category
- Savings efficiency signal
- Net worth momentum signal

### 5) Analytics Integration (GA4-Compatible)

- GA4 initialization through environment configuration
- Event tracking for:
  - page view
  - search usage
  - navigation clicks
  - transaction filter clicks
  - execute strategy CTA clicks

## Folder Structure

```text
src/
  app/
    AppShell.jsx
  components/
    layout/
      Header.jsx
      Sidebar.jsx
      MainContent.jsx
    ui/
      LoadingState.jsx
      ErrorState.jsx
      EmptyState.jsx
  features/
    summary/
      components/
      data/
    insights/
      components/
      engine/
    transactions/
      components/
      charts/
      data/
    index.js
  hooks/
    useFetch.js
    useDebounce.js
    useLocalStorage.js
    useAnalytics.js
    index.js
  lib/
    constants.js
    analytics/
      initGA4.js
```

## Architecture Decisions

### Feature-Driven Boundaries

Feature modules under `src/features/` isolate domain logic and UI by business area (`summary`, `insights`, `transactions`), reducing coupling and making future expansion safer.

### Shared UI State Patterns

Global UI states (`LoadingState`, `ErrorState`, `EmptyState`) are reusable across features for consistency and lower maintenance cost.

### App Shell Composition

`AppShell` handles high-level state orchestration (active nav, search query, analytics triggers), while section components own local feature logic.

## Custom Hooks

### `useFetch`

Reusable async lifecycle helper:

- standardizes loading/error/data flow
- provides `refetch`
- guards state updates when unmounted

### `useDebounce`

Used for search throttling in the header to avoid noisy state churn and to improve perceived responsiveness.

### `useLocalStorage`

Persists user context (`activeNavId`) to keep navigation continuity across reloads.

### `useAnalytics`

Thin tracking abstraction so components track events consistently without directly coupling to analytics provider implementation.

## Performance Optimizations

- Lazy-loaded feature sections via `React.lazy` + `Suspense`
- Lazy-loaded heavy chart components
- Memoized presentational components (`React.memo`) for high-frequency renders
- Stable callbacks with `useCallback` to prevent avoidable child re-renders
- Build output split into async chunks to reduce initial payload

## SEO & Accessibility

### SEO

- `description`, `keywords`, `robots`
- Open Graph and Twitter meta tags
- Canonical URL
- Dynamic document title updates based on active section

### Accessibility

- Semantic landmarks (`header`, `main`, section headings)
- Skip-to-content link for keyboard users
- Focus-visible ring styles
- Search status with `aria-live`
- Enhanced ARIA labels for controls and charts
- Improved table semantics (`caption`, `scope="col"`)

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

If not provided, the app still works; analytics initialization is skipped safely.

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

## Trade-offs & Notes

- Mock datasets are intentionally used for assignment scope; real API integration can plug into existing `useFetch` flows.
- Charts are dynamically loaded for better first load performance, but still add bundle cost once accessed.
- Current implementation is JavaScript-first for speed; TypeScript migration is straightforward due to modular boundaries.

## Deployment

The app is Vite-compatible and can be deployed on:

- Vercel
- Netlify
- GitHub Pages (with Vite base path configuration if needed)

## Future Improvements

- Real backend/API integration with auth-aware user data
- Date-range filtering and advanced transaction querying
- Dark mode with design tokens
- Test coverage (unit + component + end-to-end)
- Role-based personalization and secure preference sync
