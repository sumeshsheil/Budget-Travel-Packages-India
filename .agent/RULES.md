# ⛔ STRICT RULES — Budget Travel Packages Admin Panel

> These rules are **NON-NEGOTIABLE**. Every file written, every component created, every line of code must comply. Violation of any rule requires immediate correction.

---

## 🚫 Rule 1: DO NOT TOUCH THE LANDING PAGE

- **NEVER** modify any file inside `src/components/landing/`
- **NEVER** modify `src/app/page.tsx`
- **NEVER** change the existing CSS variables in `globals.css`:
  ```css
  --color-primary: #01ff70;
  --color-secondary: #98050b;
  --color-secondary-text: #1d1c1c;
  --color-accent: #fed618;
  --font-inter: var(--font-inter);
  --font-open-sans: var(--font-open-sans);
  ```
- **NEVER** modify or remove `.container-box`, `.text-20px`, `.hero-section-bg-overlay-gradient`, or `.scrollbar-hide` classes
- Admin panel CSS variables must be **added below** the existing theme block, scoped appropriately
- Admin panel components go in `src/components/ui/` and `src/components/admin/` — **NOT** in `src/components/landing/`

---

## 🚫 Rule 2: USE `proxy.ts` NOT `middleware.ts`

- **Next.js 16 renamed middleware to proxy**
- The file must be named `proxy.ts` (in `src/` if using src directory, otherwise at project root)
- Export `proxy()` function, NOT `middleware()`
- Export `config` (the matcher config export name remains `config`)
- Reference: Next.js 16 file conventions

```ts
// ✅ CORRECT — proxy.ts
export async function proxy(request: NextRequest) { ... }
export const config = { matcher: [...] };

// ❌ WRONG — middleware.ts
export function middleware(request: NextRequest) { ... }
export const config = { matcher: [...] };
```

---

## 🚫 Rule 3: ASYNC PARAMS AND COOKIES (Next.js 15+/16)

- `params` and `searchParams` are **async** — always `await` them
- `cookies()` and `headers()` are **async** — always `await` them
- Type params as `Promise<{ ... }>`

```ts
// ✅ CORRECT
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
}

// ❌ WRONG
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params; // Will break in Next.js 16
}
```

---

## 🚫 Rule 4: SERVER/CLIENT COMPONENT BOUNDARIES

- **Client Components** (`'use client'`):
  - Cannot be `async`
  - Cannot directly access database
  - Must receive serializable props only (no `Date`, `Map`, `Set`, functions — except Server Actions)
- **Server Components** (default):
  - Can be `async`
  - Can access database directly
  - Cannot use hooks (`useState`, `useEffect`, etc.)
  - Cannot use event handlers (`onClick`, etc.)

```ts
// ✅ CORRECT — Fetch in server, pass to client
// page.tsx (server)
export default async function Page() {
  const leads = await getLeads();
  return <LeadTable leads={JSON.parse(JSON.stringify(leads))} />;
}

// LeadTable.tsx (client)
"use client";
export function LeadTable({ leads }: { leads: Lead[] }) { ... }

// ❌ WRONG — Async client component
"use client";
export default async function LeadTable() {
  const leads = await getLeads(); // Cannot await in client
}
```

---

## 🚫 Rule 5: USE SERVER ACTIONS FOR MUTATIONS

- All data mutations (create, update, delete) must use **Server Actions** (`'use server'`)
- Do NOT create Route Handlers for mutations triggered from the UI
- Route Handlers are only for:
  - Public API endpoints (landing page form submission)
  - External integrations / webhooks
  - Cron jobs
- Navigation functions (`redirect`, `notFound`, etc.) must be called **outside** try-catch blocks

```ts
// ✅ CORRECT
"use server";
export async function createAgent(formData: FormData) {
  let agent;
  try {
    agent = await Agent.create(data);
  } catch (error) {
    return { error: "Failed to create agent" };
  }
  redirect(`/admin/agents/${agent._id}`); // Outside try-catch
}

// ❌ WRONG
export async function createAgent(formData: FormData) {
  try {
    const agent = await Agent.create(data);
    redirect(`/admin/agents/${agent._id}`); // Inside try-catch — will break!
  } catch (error) {
    return { error: "Failed" };
  }
}
```

---

## 🚫 Rule 6: MONGODB + MONGOOSE ONLY

- Do NOT use Prisma, Drizzle, or any other ORM
- Use Mongoose ODM exclusively
- Always use the cached connection pattern (prevent multiple connections in dev)
- Always call `await connectDB()` before any database operation
- Mongoose models must be in `src/lib/db/models/`

---

## 🚫 Rule 7: AUTHENTICATION RULES

- **No self-registration** — Only admin can create accounts
- **No public signup page** exists
- Admin creates agent accounts → Resend email with temp password
- Every Server Action must verify session: `const session = await auth(); if (!session) throw ...`
- Every API Route must verify auth token
- Role checks must happen in both:
  1. `proxy.ts` (URL-level protection)
  2. Server Actions / Route Handlers (data-level protection)

---

## 🚫 Rule 8: FORM VALIDATION

- **ALWAYS** validate with Zod on **both** client and server
- Client-side: React Hook Form + `@hookform/resolvers/zod`
- Server-side: `zodSchema.safeParse(data)` inside every Server Action
- Never trust client-side validation alone

---

## 🚫 Rule 9: SHADCN/UI COMPONENT RULES

- Install components via CLI: `npx shadcn@latest add <component>`
- Never copy-paste component code manually
- Use `cn()` utility for all class merging
- Preserve all Radix ARIA attributes — do not remove accessibility features
- Always include `DialogTitle` in dialogs (accessibility requirement)
- Always associate labels with form controls
- Use `asChild` prop for custom trigger elements
- Focus visible styles must never be removed

---

## 🚫 Rule 10: FILE STRUCTURE

```
src/
├── app/
│   ├── admin/
│   │   ├── login/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── agents/
│   │   │   ├── leads/
│   │   │   └── settings/
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   └── loading.tsx
│   ├── api/
│   │   ├── admin/          # Protected API routes
│   │   ├── leads/submit/   # Public lead submission
│   │   └── cron/           # Cron jobs
│   ├── globals.css         # DO NOT modify existing, only append
│   ├── layout.tsx          # DO NOT modify
│   └── page.tsx            # DO NOT modify
├── components/
│   ├── ui/                 # shadcn components (auto-generated)
│   ├── admin/              # Admin panel components
│   │   ├── layout/         # Sidebar, Header, etc.
│   │   ├── leads/          # Lead-specific components
│   │   ├── agents/         # Agent-specific components
│   │   └── dashboard/      # Dashboard widgets
│   └── landing/            # ⛔ DO NOT TOUCH
├── hooks/                  # Custom hooks (useInactivityLogout, etc.)
├── lib/
│   ├── auth.ts             # NextAuth configuration
│   ├── db/
│   │   ├── mongoose.ts     # DB connection
│   │   └── models/         # Mongoose models
│   ├── rate-limit.ts       # IP rate limiting
│   ├── utils.ts            # cn() utility
│   └── redux/              # DO NOT modify existing
└── types/                  # Shared TypeScript types
```

---

## 🚫 Rule 11: ERROR HANDLING

- Every route segment under `/admin` must have `error.tsx` and `loading.tsx`
- `error.tsx` must be a Client Component (`'use client'`)
- Never swallow errors silently
- Use `unstable_rethrow()` if navigation functions are inside try-catch
- Use `Suspense` boundaries for streaming data

---

## 🚫 Rule 12: PERFORMANCE

- Lazy load heavy components (> 50KB) with `dynamic(() => import(...))`
- Use direct imports for Lucide icons: `import { Icon } from "lucide-react"`
- Use `Skeleton` components for all loading states
- Debounce search/filter inputs (300ms minimum)
- Paginate all list views server-side
- Serialize Mongoose documents before passing to client components: `JSON.parse(JSON.stringify(doc))`

---

## 🚫 Rule 13: RESPONSIVE DESIGN

- Mobile-first approach: start with mobile styles, enhance for larger screens
- Minimum touch target: 44x44px for all interactive elements
- No horizontal scrolling (except Kanban board)
- Tables must render as cards on mobile (< 768px)
- Sidebar must be a Sheet component on mobile
- Use `clamp()` for fluid typography where appropriate

---

## 🚫 Rule 14: CODING STANDARDS

- TypeScript strict mode (already enabled)
- No `any` type — use proper typing always
- No `console.log` in production code — use proper error boundaries
- Prefer `const` over `let`, never use `var`
- Use named exports for components, default exports for pages
- Every component must have proper TypeScript interface/type for props
- Use absolute imports with `@/` prefix always

---

## Summary Quick Reference

| Topic            | Rule                                               |
| ---------------- | -------------------------------------------------- |
| Landing Page     | ⛔ NEVER modify                                    |
| Route Protection | Use `proxy.ts`, NOT `middleware.ts`                |
| Params/Cookies   | Always `await` (async in Next.js 16)               |
| Mutations        | Server Actions, NOT Route Handlers                 |
| Database         | Mongoose only, cached connection                   |
| Auth             | No self-registration, admin invite only            |
| Validation       | Zod on both client AND server                      |
| shadcn           | CLI install only, preserve accessibility           |
| Components       | Server by default, `'use client'` only when needed |
| Error Handling   | `error.tsx` in every route segment                 |
| Responsiveness   | Mobile-first, 44px touch targets                   |
