# WealthCurator AI - Personal Finance Dashboard

A production-quality, AI-powered personal finance dashboard built with React, Vite, and Tailwind CSS. This project demonstrates fintech-grade frontend engineering with pixel-perfect UI implementation, custom hooks, performance optimization, and analytics integration.

![WealthCurator AI](https://img.shields.io/badge/React-19-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple) ![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan) ![License](https://img.shields.io/badge/License-MIT-green)

## Live Demo

**[https://wealth-curator-ai.vercel.app](https://wealth-curator-ai.vercel.app)**

## Features

### Core Dashboard Pages

| Page | Description |
|------|-------------|
| **Dashboard** | Portfolio overview with net worth, spending, savings cards, AI strategy insights, and active alerts |
| **Accounts** | Design system showcase with typography, color tokens, interactive elements, and transactional ledger |
| **Transactions** | Monthly overview with budget velocity, category allocation, and recent alerts |
| **Budgets** | Wealth curator summary with spending categories, budget history chart, and AI optimization tips |
| **Insights** | Market intelligence with sentiment index, portfolio velocity chart, and sector allocation |

### Key Capabilities

- **Dark/Light Mode** - Full theme support with seamless switching
- **AI-Driven Insights** - Dynamic, data-based financial recommendations
- **Responsive Design** - Optimized for desktop viewing
- **Real-time Analytics** - GA4 integration for event tracking
- **Performance Optimized** - Lazy loading, code splitting, memoization

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| Vite 5 | Build tool & dev server |
| Tailwind CSS 3 | Utility-first styling |
| ESLint | Code quality |
| Google Analytics 4 | Event tracking |

## Project Structure

```
src/
├── app/
│   └── AppShell.jsx              # Root layout & state orchestration
├── components/
│   ├── layout/
│   │   ├── Header.jsx            # Top navigation, search, theme toggle
│   │   ├── Sidebar.jsx           # Left navigation with icons
│   │   └── MainContent.jsx       # Dynamic content routing
│   └── ui/
│       ├── LoadingState.jsx      # Loading skeleton
│       ├── ErrorState.jsx        # Error with retry
│       └── EmptyState.jsx        # Empty data placeholder
├── features/
│   ├── portfolio/                # Dashboard page
│   ├── insights/                 # Insights page + AI engine
│   ├── transactions/             # Markets page
│   ├── budgets/                  # Transactions & Budgets pages
│   ├── design-system/            # Accounts page (Design System)
│   └── summary/                  # Summary cards
├── hooks/
│   ├── useFetch.js               # Async data fetching
│   ├── useDebounce.js            # Input throttling
│   ├── useLocalStorage.js        # Persistent state
│   └── useAnalytics.js           # GA4 event tracking
└── lib/
    ├── constants.js              # App constants
    ├── analytics/                # GA4 initialization
    └── search/                   # Dashboard search logic
```

## Custom Hooks

### `useFetch`
Reusable async data fetching with standardized loading/error/data lifecycle.

```javascript
const { data, isLoading, error, refetch } = useFetch(fetchFunction, {
  initialData: null,
  immediate: true,
});
```

**Features:**
- Automatic loading state management
- Error handling with retry capability
- Cleanup on unmount to prevent memory leaks
- Configurable immediate execution

### `useDebounce`
Throttles rapid input changes for search optimization.

```javascript
const debouncedValue = useDebounce(searchQuery, 300);
```

**Use Case:** Prevents excessive re-renders during search typing

### `useLocalStorage`
Persists user preferences across sessions.

```javascript
const [theme, setTheme] = useLocalStorage('theme', 'dark');
```

**Use Case:** Saves active navigation, theme preference

### `useAnalytics`
Abstraction layer for GA4 event tracking.

```javascript
const { trackEvent, trackPageView } = useAnalytics();
trackEvent('cta_click', { button: 'execute_strategy' });
```

**Tracked Events:**
- Page views
- Search usage
- Navigation clicks
- Filter interactions
- CTA button clicks

## Architecture Decisions

### 1. Feature-Driven Module Boundaries
Each feature (`portfolio`, `insights`, `transactions`, `budgets`) is self-contained with its own components, data, and logic. This reduces coupling and enables independent development.

### 2. Centralized State Orchestration
`AppShell` manages global UI state (active nav, search query, theme) while feature components handle local logic. This separation ensures predictable data flow.

### 3. Lazy Loading Strategy
All feature sections are lazily loaded via `React.lazy` + `Suspense`, reducing initial bundle size from ~250KB to ~70KB for faster first paint.

### 4. Design Token System
Tailwind config extends with custom colors, spacing, and typography tokens for consistent styling across all components.

## Performance Optimizations

| Optimization | Implementation |
|--------------|----------------|
| **Code Splitting** | `React.lazy()` for all feature sections |
| **Lazy Loading** | `Suspense` with loading fallbacks |
| **Memoization** | `React.memo` on presentational components |
| **Stable Callbacks** | `useCallback` prevents child re-renders |
| **Computed Values** | `useMemo` for derived data calculations |
| **Asset Optimization** | Vite's built-in minification and tree-shaking |

### Build Output
```
dist/index.html                    1.86 kB │ gzip: 0.69 kB
dist/assets/index.css             38.84 kB │ gzip: 6.89 kB
dist/assets/index.js             216.54 kB │ gzip: 67.18 kB
```

## SEO Implementation

### Meta Tags
```html
<title>WealthCurator AI Dashboard</title>
<meta name="description" content="AI-powered personal finance dashboard..." />
<meta name="keywords" content="finance, dashboard, AI, wealth management" />
```

### Open Graph
```html
<meta property="og:title" content="WealthCurator AI Dashboard" />
<meta property="og:description" content="Track your finances with AI insights" />
<meta property="og:type" content="website" />
```

### Accessibility Features
- Semantic HTML5 landmarks (`header`, `main`, `nav`, `section`)
- Skip-to-content link for keyboard users
- ARIA labels on interactive elements
- Focus-visible ring styles
- Screen reader announcements for dynamic content

## AI Insights Engine

The `generateInsights` function creates dynamic, context-aware financial recommendations based on user data:

```javascript
// Example generated insights:
- "Your tech exposure increased by 14% this quarter"
- "Consolidating streaming subscriptions could save $42/month"
- "Emergency fund reached target - consider reallocating overflow"
```

**Logic includes:**
- Cashflow analysis (income vs expenses ratio)
- Category concentration detection
- Savings efficiency scoring
- Net worth momentum tracking

## Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/anujsoni3/WealthCurator-AI.git
cd WealthCurator-AI

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Configure Google Analytics (optional):
```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Trade-offs & Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Mock Data** | Assignment scope; real API can plug into existing `useFetch` flows |
| **SVG Charts** | Lightweight alternative to chart libraries; matches design fidelity |
| **JavaScript** | Faster development; TypeScript migration is straightforward |
| **Tailwind** | Rapid UI development with design token consistency |
| **No External State** | App complexity doesn't warrant Redux/Zustand overhead |

## Future Improvements

- [ ] Real API integration with authentication
- [ ] Date-range filtering for transactions
- [ ] Table virtualization for large datasets
- [ ] Unit and E2E test coverage
- [ ] React Native Web for mobile support
- [ ] PWA support for offline access

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - feel free to use this project as a reference or starting point.

---

**Built with care for the Frontend Intern Assignment**

[Live Demo](https://wealth-curator-ai.vercel.app) | [GitHub Repository](https://github.com/anujsoni3/WealthCurator-AI)
