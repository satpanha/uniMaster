# Sport Competition Management System - Architecture

## Overview
Production-ready admin dashboard for MOEYS (Ministry of Education, Youth and Sport) built with Next.js App Router, TypeScript, and clean architecture principles.

## Core Principles

### 1. Event-Centric Architecture
All data is scoped by Event:
- Event → Sports → Athletes → Medals
- Provinces aggregate medals per event
- Navigation is event-aware

### 2. Component Strategy
```
components/
├── ui/              → Atomic, reusable primitives (Button, Card, Table, Badge)
├── shared/          → Cross-feature utilities (FilterPanel, TableActions)
└── sections/        → Domain-aware compositions
    ├── dashboard/   → Dashboard-specific sections
    ├── events/      → Event management sections
    ├── sports/      → Sports management sections
    ├── athletes/    → Athletes management sections
    ├── medals/      → Medals management sections
    └── provinces/   → Province rankings sections
```

**No `features/` folder** - sections handle domain composition.

### 3. Styling Strategy
- **Single source**: `app/globals.css`
- **Design tokens**: CSS variables for colors, spacing, shadows
- **No inline styles** except for dynamic hover states
- **Utility classes**: Defined in globals.css

## File Structure

```
/home/satpanha/full-stack/unimaster/
├── app/
│   ├── globals.css                    → All styling + design tokens
│   ├── layout.tsx                     → Root layout
│   ├── page.tsx                       → Redirects to /dashboard
│   └── (dashboard)/
│       ├── layout.tsx                 → Sidebar navigation
│       ├── dashboard/
│       │   └── page.tsx              → Main dashboard
│       └── events/
│           ├── page.tsx              → Events list
│           └── [eventId]/
│               ├── page.tsx          → Event dashboard
│               ├── sports/
│               │   ├── page.tsx      → Sports list
│               │   └── [sportId]/
│               │       ├── page.tsx  → Sport details
│               │       └── athletes/
│               │           └── page.tsx → Athletes for sport
│               ├── medals/
│               │   └── page.tsx      → Medals list
│               └── provinces/
│                   └── page.tsx      → Province rankings
│
├── components/
│   ├── ui/                           → Atomic components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Table.tsx
│   │   ├── Modal.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   └── index.ts
│   │
│   ├── shared/                       → Reusable utilities
│   │   ├── FilterPanel.tsx
│   │   ├── TableActions.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── index.ts
│   │
│   └── sections/                     → Domain compositions
│       ├── dashboard/
│       │   ├── DashboardHeader.tsx   → Page title + event selector
│       │   ├── DashboardStats.tsx    → 4-card stats grid
│       │   ├── RecentRegistrations.tsx → Latest athletes
│       │   ├── MedalStandings.tsx    → Province rankings
│       │   ├── MedalDistributionChart.tsx → Visual chart
│       │   ├── QuickActions.tsx      → Action buttons
│       │   └── index.ts
│       │
│       ├── events/
│       │   ├── EventOverview.tsx     → Event details card
│       │   ├── EventSelector.tsx     → Dropdown switcher
│       │   └── index.ts
│       │
│       ├── sports/
│       │   ├── SportsTable.tsx       → Sports data table
│       │   └── index.ts
│       │
│       ├── athletes/
│       │   ├── AthletesTable.tsx     → Athletes data table
│       │   └── index.ts
│       │
│       ├── medals/
│       │   ├── MedalsTable.tsx       → Medals data table
│       │   └── index.ts
│       │
│       └── provinces/
│           ├── ProvincesTable.tsx    → Province rankings
│           └── index.ts
│
├── src/
│   ├── lib/                          → Business logic
│   │   ├── core/                     → Utilities
│   │   ├── data/                     → Data loaders/selectors
│   │   ├── api/                      → CRUD operations
│   │   ├── validation/               → Form validators
│   │   ├── calc/                     → Pure calculations
│   │   └── export/                   → CSV export
│   │
│   └── types/                        → TypeScript definitions
│       ├── event.ts
│       ├── sport.ts
│       ├── athlete.ts
│       ├── medal.ts
│       ├── province.ts
│       └── index.ts
│
└── public/                           → Static assets
```

## Domain Model

### Event (Root Context)
```typescript
interface Event {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status?: 'active' | 'upcoming' | 'completed';
}
```

### Sport (Event-scoped)
```typescript
interface Sport {
  id: string;
  name: string;
  eventId: string;
  category?: string;
  currentParticipants?: number;
  maxParticipants?: number;
  status?: string;
}
```

### Athlete (Event + Sport + Province scoped)
```typescript
interface Athlete {
  id: string;
  name: string;
  sportId: string;
  province?: string; // province name
  age?: number;
}
```

### Medal (Event + Sport + Athlete + Province scoped)
```typescript
interface Medal {
  id: string;
  eventId: string;
  athleteId: string;
  province?: string; // province name
  medalType: 'gold' | 'silver' | 'bronze';
  athleteName?: string;
  sportName?: string;
  awardedDate?: string;
}
```

### Province
```typescript
interface Province {
  id: string;
  name: string;
}
```

## Sections Breakdown

### Dashboard Sections
1. **DashboardHeader**: Title + subtitle + optional event selector
2. **DashboardStats**: 4-card grid (Athletes, Sports, Provinces, Medals) with % change
3. **RecentRegistrations**: Table of latest athlete registrations with status badges
4. **MedalStandings**: Province rankings table with medal counts
5. **MedalDistributionChart**: Visual bar chart of medal distribution
6. **QuickActions**: Quick access buttons (Register Athlete, Add Sport, Export Data)

### Event Sections
1. **EventOverview**: Card showing event name, dates, status
2. **EventSelector**: Dropdown to switch between events

### Domain Sections
1. **SportsTable**: List of sports with category, participants, status
2. **AthletesTable**: List of athletes with sport, province, age
3. **MedalsTable**: List of medals with athlete, sport, province, date
4. **ProvincesTable**: Province rankings with medal counts

## Navigation Structure

```
Dashboard (/)
├── Events (/events)
│   └── [eventId] (/events/[eventId])
│       ├── Sports (/events/[eventId]/sports)
│       │   └── [sportId] (/events/[eventId]/sports/[sportId])
│       │       └── Athletes (/events/[eventId]/sports/[sportId]/athletes)
│       ├── Medals (/events/[eventId]/medals)
│       └── Provinces (/events/[eventId]/provinces)
```

## Styling Guide

### Design Tokens (CSS Variables)
```css
--bg: #f8fafc              /* App background */
--bg-card: #ffffff         /* Card background */
--bg-muted: #f1f5f9        /* Subtle sections */
--text-primary: #0f172a    /* Main text */
--text-secondary: #475569  /* Secondary text */
--text-muted: #64748b      /* Muted text */
--primary: #2563eb         /* Brand color */
--success: #16a34a         /* Success state */
--warning: #f59e0b         /* Warning state */
--danger: #dc2626          /* Danger state */
--border: #e2e8f0          /* Default border */
--radius-sm: 6px           /* Small radius */
--radius-md: 10px          /* Medium radius */
--shadow-sm: ...           /* Small shadow */
--shadow-md: ...           /* Medium shadow */
```

### Utility Classes
```css
.card                      /* Standard card */
.card-header              /* Card header with flex-between */
.card-title               /* Card title text */
.table                    /* Data table */
.table-row-hover          /* Hoverable table row */
.badge                    /* Badge base */
.badge-primary/.success   /* Badge variants */
.flex-between             /* Flex justify-between */
.text-muted               /* Muted text */
.text-right               /* Right-aligned text */
```

## Data Flow

1. **Pages**: Fetch data, pass to sections
2. **Sections**: Compose UI, receive props, no business logic
3. **UI Components**: Pure presentation, styled with globals.css
4. **Lib**: Handle business logic, data fetching, calculations

## Best Practices

### ✅ Do
- Use sections for page composition
- Keep UI components in `ui/` purely presentational
- Use CSS variables from `globals.css`
- Scope data by event
- Export section bundles via `index.ts`

### ❌ Don't
- Put business logic in sections or UI components
- Create a `features/` folder
- Use inline styles (except for dynamic hover states)
- Duplicate table/card logic
- Mix presentation with data fetching

## Development Workflow

1. **Create section**: Add to `components/sections/{domain}/`
2. **Import in page**: Use section in app route
3. **Style with tokens**: Reference `globals.css` variables
4. **Type props**: Use types from `src/types/`
5. **Pass data**: Page fetches → Section renders

## Example Page Structure

```tsx
import { DashboardHeader, DashboardStats } from '@/components/sections/dashboard';
import { SportsTable } from '@/components/sections/sports';

export default function SportsPage() {
  // Fetch data (replace with actual API)
  const sports = [...];
  
  return (
    <div className="dashboard-content">
      <DashboardHeader title="Sports" subtitle="Manage sports" />
      <SportsTable sports={sports} />
    </div>
  );
}
```

## Next Steps

1. **Connect real data**: Replace mock data with API calls
2. **Add modals**: Implement CRUD modals using `Modal` component
3. **Filtering**: Add filter controls using `FilterPanel`
4. **Export**: Wire up CSV export using `lib/export`
5. **Authentication**: Add auth layer
6. **Validation**: Use validators from `lib/validation`

---

**Built with production-grade architecture principles for MOEYS Sport Competition Management System.**
