# Admin Panel — Full Implementation Plan

> **Last Updated**: 2026-02-10
> **Project**: Budget Travel Packages
> **Strict Rules**: See `.agent/RULES.md` for non-negotiable coding rules

---

## Overview

Build a **secure, fully responsive admin panel** for the Budget Travel Packages project using **shadcn/ui**. The admin panel will include:

- **Role-based authentication** (Admin + Agents)
- **Agent management** (admin creates agent accounts)
- **Lead management** with pipeline stages & auto-stale detection
- **30-minute inactivity auto-logout**
- **IP-based rate limiting** for lead submissions
- **Email notifications** via Resend
- **SMS verification** (Indian provider — TBD)

---

## Tech Stack

| Layer                    | Technology                                                  |
| ------------------------ | ----------------------------------------------------------- |
| **Framework**            | Next.js 16 (App Router)                                     |
| **UI Library**           | shadcn/ui (Radix primitives + Tailwind CSS)                 |
| **Auth**                 | NextAuth.js v5 (credentials provider, JWT sessions)         |
| **Database**             | MongoDB + Mongoose ODM                                      |
| **Validation**           | Zod (already installed)                                     |
| **State**                | Redux Toolkit (already installed) + React Server Components |
| **Forms**                | React Hook Form + Zod resolver                              |
| **Icons**                | Lucide React (already installed)                            |
| **Email Service**        | Resend                                                      |
| **Notification Service** | Resend                                                      |
| **SMS Service**          | TBD — Indian-based SMS provider (will integrate later)      |

---

## Roles & Permissions Matrix

| Action                   | Admin | Agent               |
| ------------------------ | ----- | ------------------- |
| Login                    | ✅    | ✅                  |
| View Dashboard           | ✅    | ✅ (own stats only) |
| Create Agent Account     | ✅    | ❌                  |
| Edit/Deactivate Agent    | ✅    | ❌                  |
| View All Leads           | ✅    | ❌                  |
| View Assigned Leads Only | —     | ✅                  |
| Create New Lead          | ✅    | ✅                  |
| Update Lead Stage        | ✅    | ✅ (own leads)      |
| Assign Lead to Agent     | ✅    | ❌                  |
| Delete Lead              | ✅    | ❌                  |
| Access Settings          | ✅    | ❌                  |
| Register Without Invite  | ❌    | ❌                  |

> **CRITICAL**: No one can create an account without admin invitation. The admin manually creates agent accounts from the dashboard.

---

## Phase 1: Foundation Setup

### 1.1 Install Dependencies

```bash
# shadcn/ui setup
npx shadcn@latest init

# Auth + DB
npm install next-auth@beta mongoose bcryptjs
npm install -D @types/bcryptjs

# Forms
npm install react-hook-form @hookform/resolvers

# Email
npm install resend
```

### 1.2 Initialize shadcn/ui

> ⚠️ **RULE**: Do NOT modify the landing page. `globals.css` existing theme variables (`--color-primary`, `--color-secondary`, fonts) must remain untouched. shadcn theming must be ADDITIVE only — add admin-specific CSS variables under a scoped section.

- Configure `components.json` with proper path aliases (`@/`)
- Add shadcn CSS variables BELOW existing theme block in `globals.css`
- Create `cn()` utility in `src/lib/utils.ts`
- shadcn components go into `src/components/ui/` (separate from `src/components/landing/`)

### 1.3 Install shadcn Components

```bash
npx shadcn@latest add button card input label form dialog table badge
npx shadcn@latest add dropdown-menu avatar sidebar sheet separator
npx shadcn@latest add select tabs toast sonner skeleton alert
npx shadcn@latest add popover command checkbox textarea
```

### 1.4 Database Setup (MongoDB + Mongoose)

#### Connection

```ts
// src/lib/db/mongoose.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
```

#### Models

**User Model** (shared for Admin & Agent):

```ts
// src/lib/db/models/User.ts
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // bcrypt hashed
  name: { type: String, required: true },
  role: { type: String, enum: ["admin", "agent"], required: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  phone: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
```

**Lead Model** (fields match landing page form):

```ts
// src/lib/db/models/Lead.ts
const LeadSchema = new mongoose.Schema({
  // === FROM LANDING PAGE FORM (Step 1) ===
  tripType: {
    type: String,
    enum: ["domestic", "international"],
    required: true,
  },
  departureCity: { type: String, required: true },
  destination: { type: String, required: true },
  travelDate: { type: String, required: true }, // DD/MM/YYYY format
  duration: { type: String, required: true },
  guests: { type: Number, required: true, min: 1, max: 50 },
  budget: { type: Number, required: true, min: 1 },

  // === FROM LANDING PAGE FORM (Step 2) ===
  specialRequests: { type: String, maxlength: 500 },
  travelers: [
    {
      name: { type: String, required: true },
      age: { type: Number, required: true },
      gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true,
      },
      email: { type: String, required: true },
      phone: { type: String, required: true }, // Indian 10-digit: /^[6-9]\d{9}$/
    },
  ],

  // === CRM FIELDS (Admin Panel) ===
  source: {
    type: String,
    enum: [
      "website",
      "referral",
      "social_media",
      "phone",
      "email",
      "walk_in",
      "other",
    ],
    default: "website",
  },
  stage: {
    type: String,
    enum: [
      "new",
      "contacted",
      "qualified",
      "proposal_sent",
      "negotiation",
      "won",
      "lost",
      "stale",
    ],
    default: "new",
  },
  previousStage: { type: String }, // stores stage before auto-stale
  notes: { type: String },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ipAddress: { type: String }, // for rate limiting

  // === TIMESTAMPS ===
  lastActivityAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
```

**LeadActivity Model**:

```ts
// src/lib/db/models/LeadActivity.ts
const LeadActivitySchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who did the action
  action: { type: String, required: true }, // "stage_changed", "note_added", "agent_assigned", etc.
  details: { type: String },
  fromStage: { type: String },
  toStage: { type: String },
  createdAt: { type: Date, default: Date.now },
});
```

**IPRateLimit Model**:

```ts
// src/lib/db/models/IPRateLimit.ts
const IPRateLimitSchema = new mongoose.Schema({
  ipAddress: { type: String, required: true, unique: true },
  leadCount: { type: Number, default: 0 },
  windowStart: { type: Date, default: Date.now },
  blockedUntil: { type: Date },
});
```

---

## Phase 2: Authentication System

### 2.1 Architecture

- **No self-registration**. Only admin can create accounts (both admin and agent).
- Admin creates agent account → agent receives email with temporary password → agent logs in and can change password.
- JWT session strategy with 30-minute maxAge.
- Role stored in JWT token for middleware/proxy checks.

### 2.2 NextAuth Configuration

```ts
// src/lib/auth.ts (or src/auth.ts)
export const authConfig = {
  providers: [
    Credentials({
      authorize: async (credentials) => {
        // 1. Validate credentials with Zod
        // 2. Find user in MongoDB
        // 3. Compare bcrypt password
        // 4. Check user.status === "active"
        // 5. Return { id, email, name, role }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role;
        token.userId = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.role = token.role;
      session.user.id = token.userId;
      return session;
    },
  },
};
```

### 2.3 Route Protection via `proxy.ts` (Next.js 16+)

> ⚠️ **RULE**: Use `proxy.ts` NOT `middleware.ts`. Next.js 16 renamed middleware to proxy.

```ts
// proxy.ts (root of project)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Public routes
  if (pathname.startsWith("/admin/login")) {
    if (token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Protected admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    // Agent trying to access admin-only routes
    if (token.role === "agent" && pathname.startsWith("/admin/agents")) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (token.role === "agent" && pathname.startsWith("/admin/settings")) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // Protected API routes
  if (pathname.startsWith("/api/admin")) {
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const proxyConfig = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
```

### 2.4 File Structure

```
src/app/admin/
├── login/
│   └── page.tsx                # Login page (public)
├── (dashboard)/
│   ├── layout.tsx              # Protected layout with sidebar + inactivity tracker
│   ├── page.tsx                # Dashboard overview
│   ├── agents/
│   │   ├── page.tsx            # Agent list (admin only)
│   │   └── [id]/
│   │       └── page.tsx        # Agent detail (admin only)
│   ├── leads/
│   │   ├── page.tsx            # Lead pipeline / table view
│   │   └── [id]/
│   │       └── page.tsx        # Lead detail
│   └── settings/
│       └── page.tsx            # Admin settings (admin only)
├── error.tsx                   # Error boundary
├── not-found.tsx               # 404 page
└── loading.tsx                 # Loading skeleton
```

### 2.5 Inactivity Auto-Logout (30 Minutes)

```tsx
// src/hooks/useInactivityLogout.ts
"use client";

import { useEffect, useRef, useCallback } from "react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_BEFORE = 5 * 60 * 1000; // Warn at 25 minutes

export function useInactivityLogout() {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const warningRef = useRef<NodeJS.Timeout>();

  const resetTimer = useCallback(() => {
    clearTimeout(timeoutRef.current);
    clearTimeout(warningRef.current);

    warningRef.current = setTimeout(() => {
      toast.warning("Session expiring in 5 minutes due to inactivity");
    }, INACTIVITY_TIMEOUT - WARNING_BEFORE);

    timeoutRef.current = setTimeout(() => {
      signOut({ callbackUrl: "/admin/login" });
    }, INACTIVITY_TIMEOUT);
  }, []);

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      clearTimeout(timeoutRef.current);
      clearTimeout(warningRef.current);
    };
  }, [resetTimer]);
}
```

---

## Phase 3: Admin Dashboard

### 3.1 Layout

- **Sidebar** (collapsible on desktop, Sheet overlay on mobile)
  - Dashboard
  - Leads (with badge showing "new" count)
  - Agents (admin only — hidden for agents)
  - Settings (admin only — hidden for agents)
- **Header**: User avatar, role badge, logout button
- **Responsive grid**: 4-column stats on desktop, 2-column on tablet, 1-column on mobile

### 3.2 Dashboard Widgets

| Widget             | Admin View    | Agent View     |
| ------------------ | ------------- | -------------- |
| Total Leads        | All leads     | Assigned leads |
| New Leads Today    | All new today | Own new today  |
| Active Agents      | ✅            | ❌             |
| Conversion Rate    | Overall       | Personal       |
| Stale Leads        | All stale     | Own stale      |
| Recent Leads Table | All recent    | Own recent     |

---

## Phase 4: Agent Management (Admin Only)

### 4.1 Features

- **List agents** with search, filter (active/inactive), sort
- **Add new agent** via dialog form:
  - Name, Email, Phone
  - Auto-generate temporary password
  - Send welcome email via Resend with credentials
  - Zod validation
- **Edit agent** details
- **Deactivate/Activate** agent (soft toggle, doesn't delete)
- **View agent's assigned leads** with stats
- **Delete agent** (reassign or unassign leads first)

### 4.2 Server Actions

```ts
// src/app/admin/(dashboard)/agents/actions.ts
"use server";

export async function createAgent(formData: FormData) { ... }
export async function updateAgent(id: string, formData: FormData) { ... }
export async function toggleAgentStatus(id: string) { ... }
export async function deleteAgent(id: string) { ... }
```

### 4.3 API Routes (for external/mobile access if needed)

```
POST   /api/admin/agents       # Create agent
GET    /api/admin/agents       # List agents
GET    /api/admin/agents/:id   # Get agent
PATCH  /api/admin/agents/:id   # Update agent
DELETE /api/admin/agents/:id   # Delete agent
```

---

## Phase 5: Lead Management System

### 5.1 Lead Stages (Pipeline)

| Stage            | Color   | Description                       |
| ---------------- | ------- | --------------------------------- |
| 🆕 New           | Blue    | Fresh lead, not yet contacted     |
| 📞 Contacted     | Yellow  | Initial contact made              |
| ✅ Qualified     | Green   | Confirmed interest & budget       |
| 📄 Proposal Sent | Purple  | Proposal/quote sent to customer   |
| 🤝 Negotiation   | Orange  | Active negotiation                |
| 🏆 Won           | Emerald | Deal closed successfully          |
| ❌ Lost          | Red     | Lead dropped/lost                 |
| ⏳ Stale         | Gray    | No update for 7 days (auto-moved) |

### 5.2 Auto-Stale Detection

> If a lead has no activity/update for **7 consecutive days**, it automatically moves to the **Stale** stage. The `previousStage` field stores where it was before going stale. When an admin/agent reviews and updates a stale lead, it moves back to its `previousStage`.

**Implementation**: A server-side cron job (or API route called by external cron) runs daily:

```ts
// src/app/api/cron/stale-leads/route.ts
export async function GET(request: Request) {
  // Verify cron secret
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  await Lead.updateMany(
    {
      stage: { $nin: ["won", "lost", "stale"] },
      lastActivityAt: { $lt: sevenDaysAgo },
    },
    [{ $set: { previousStage: "$stage", stage: "stale" } }],
  );
}
```

### 5.3 Lead Fields (Matching Landing Page Form)

The landing page booking form collects these fields:

**Step 1 — Trip Details:**
| Field | Type | Validation |
| -------------- | -------- | ------------------------------------ |
| tripType | enum | "domestic" \| "international" |
| departureCity | string | min 2 chars, max 100 |
| destination | string | min 2 chars, max 100 |
| travelDate | string | DD/MM/YYYY format |
| duration | string | Selected from dropdown |
| guests | number | 1–50 |
| budget | number | Minimum 1 |

**Step 2 — Traveler Details:**
| Field | Type | Validation |
| --------------- | -------- | ----------------------------------- |
| specialRequests | string | Optional, max 500 chars |
| travelers[] | array | Min 1 traveler required |
| → name | string | Min 2 chars |
| → age | number | 1–120 |
| → gender | enum | "male" \| "female" \| "other" |
| → email | string | Valid email |
| → phone | string | Indian 10-digit: `/^[6-9]\d{9}$/` |

**CRM Fields (added by admin panel):**

- `source` — How the lead arrived
- `stage` — Current pipeline stage
- `notes` — Internal notes
- `agentId` — Assigned agent
- `ipAddress` — Submitter IP (for rate limiting)
- `lastActivityAt` — Last update timestamp

### 5.4 Lead Views

1. **Kanban Board View** — Drag-and-drop cards between stages (columns)
2. **Table View** — Sortable, filterable data table with pagination
3. **Toggle** between views (persisted in localStorage)

### 5.5 Lead Features

- **Create lead** (form with Zod validation — same fields as landing page)
- **Update lead stage** (drag-drop in Kanban or dropdown in table)
- **Assign/reassign agent** to lead (admin only)
- **Add notes & activity log** (timestamped history)
- **Filter by**: Stage, Agent, Source, Date range, Trip type
- **Search**: By traveler name, email, phone, destination
- **Bulk actions**: Assign agent, change stage (admin only)
- **Stale lead recovery**: Click opens lead, updates `lastActivityAt`, returns to `previousStage`

### 5.6 Server Actions

```ts
// src/app/admin/(dashboard)/leads/actions.ts
"use server";

export async function createLead(formData: FormData) { ... }
export async function updateLead(id: string, data: Partial<Lead>) { ... }
export async function updateLeadStage(id: string, newStage: string) { ... }
export async function assignAgent(leadId: string, agentId: string) { ... }
export async function addLeadNote(leadId: string, note: string) { ... }
export async function deleteLead(id: string) { ... }
```

### 5.7 API Routes

```
POST   /api/admin/leads              # Create lead
GET    /api/admin/leads              # List leads (with filters, pagination)
GET    /api/admin/leads/:id          # Get lead detail with activities
PATCH  /api/admin/leads/:id          # Update lead
DELETE /api/admin/leads/:id          # Delete lead
POST   /api/admin/leads/:id/activity # Add activity
POST   /api/leads/submit             # PUBLIC — landing page form submission
```

---

## Phase 6: IP Rate Limiting & SMS Verification

### 6.1 IP Rate Limiting (Landing Page Lead Submission)

> Same IP address cannot submit more than **3 leads per hour**. If violated, IP is blocked for 1 hour.

```ts
// src/lib/rate-limit.ts
export async function checkRateLimit(
  ipAddress: string,
): Promise<{ allowed: boolean; remaining: number }> {
  const record = await IPRateLimit.findOne({ ipAddress });

  if (record?.blockedUntil && record.blockedUntil > new Date()) {
    return { allowed: false, remaining: 0 };
  }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  if (!record || record.windowStart < oneHourAgo) {
    // Reset window
    await IPRateLimit.findOneAndUpdate(
      { ipAddress },
      { leadCount: 1, windowStart: new Date(), blockedUntil: null },
      { upsert: true },
    );
    return { allowed: true, remaining: 2 };
  }

  if (record.leadCount >= 3) {
    // Block for 1 hour
    await IPRateLimit.findOneAndUpdate(
      { ipAddress },
      { blockedUntil: new Date(Date.now() + 60 * 60 * 1000) },
    );
    return { allowed: false, remaining: 0 };
  }

  await IPRateLimit.findOneAndUpdate({ ipAddress }, { $inc: { leadCount: 1 } });
  return { allowed: true, remaining: 2 - record.leadCount };
}
```

### 6.2 SMS Verification (Future)

- Indian SMS provider (TBD)
- OTP verification before lead submission
- SMS has a cost → rate limiting prevents abuse

---

## Phase 7: Responsive Design

### 7.1 Breakpoints

| Viewport          | Layout                                                         |
| ----------------- | -------------------------------------------------------------- |
| Mobile (< 768)    | Sheet sidebar, stacked cards, single-column, card-based tables |
| Tablet (768–1024) | Compact sidebar, 2-column grid                                 |
| Desktop (> 1024)  | Full sidebar, 4-column stats, full table view                  |

### 7.2 Mobile Optimizations

- Touch-friendly 44px minimum tap targets
- Sidebar as Sheet overlay (swipeable)
- Responsive tables: card view on mobile, table view on desktop
- Fluid typography with `clamp()`
- Kanban board: horizontal scroll on mobile

---

## Security Checklist

- [x] Bcrypt password hashing (no plaintext passwords ever)
- [x] JWT sessions with 30min maxAge
- [x] Client-side inactivity tracker → auto-logout at 30min
- [x] `proxy.ts` route protection (Next.js 16 pattern) — **Fixed: `config` export name corrected**
- [x] CSRF protection (built into NextAuth)
- [x] Input validation with Zod on both client & server
- [x] Server Action auth checks (verify session in every action)
- [x] API route authentication check
- [x] Role-based access control (admin vs agent) — **Fixed: dashboard stats now scoped by role**
- [x] HTTP-only secure cookies
- [x] No sensitive data in client state
- [x] IP rate limiting: max 3 leads/hour per IP, block for 1 hour on violation (Fixed race condition)
- [ ] SMS verification for lead submissions (TBD — Indian SMS provider)
- [x] No self-registration — admin invite only
- [x] Password change on first login for agents (Enforced via proxy & UI)
- [x] `/api/seed` protected — blocked in production, requires secret in dev
- [x] `NEXTAUTH_SECRET` uses a real cryptographic key
- [x] `CRON_SECRET` configured for stale-leads cron
- [x] No `any` types in admin panel code (Rule 14 compliance)
- [x] Error boundaries (`error.tsx`, `loading.tsx`, `not-found.tsx`) (Rule 11 compliance)
- [x] Currency uses ₹ (INR) consistently across dashboard, leads, and kanban

---

## Implementation Order (Step-by-Step)

> We will work on each phase one at a time. Do NOT skip ahead.

| Step | Phase     | Description                                              | Status |
| ---- | --------- | -------------------------------------------------------- | ------ |
| 1    | Phase 1.1 | Install dependencies (shadcn, mongoose, next-auth, etc.) | ✅     |
| 2    | Phase 1.2 | Initialize shadcn/ui (without touching landing page)     | ✅     |
| 3    | Phase 1.3 | Install shadcn components                                | ✅     |
| 4    | Phase 1.4 | Set up MongoDB connection + Mongoose models              | ✅     |
| 5    | Phase 2.1 | Configure NextAuth with credentials + JWT                | ✅     |
| 6    | Phase 2.3 | Set up `proxy.ts` for route protection                   | ✅     |
| 7    | Phase 2.4 | Build login page                                         | ✅     |
| 8    | Phase 2.5 | Implement inactivity auto-logout hook                    | ✅     |
| 9    | Phase 3.1 | Build admin dashboard layout (sidebar + header)          | ✅     |
| 10   | Phase 3.2 | Build dashboard widgets & stats                          | ✅     |
| 11   | Phase 4   | Agent management (CRUD + invite flow + search)           | ✅     |
| 12   | Phase 5   | Lead management (pipeline + kanban + table + activity)   | ✅     |
| 13   | Phase 5.2 | Auto-stale detection cron job                            | ✅     |
| 14   | Phase 6   | IP rate limiting for lead submissions                    | ✅     |
| 15   | Phase 7   | Responsive polish & testing                              | ✅     |
| 16   | —         | Seed admin account & deploy preparations                 | ✅     |
