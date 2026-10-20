# Project Overview
- **App Name:** Nama' (نماء)
- **Tech Stack:** Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind CSS v4, Supabase (Auth + Postgres)
- **Primary Goal:** Residents of Dubai apartment buildings drop separated food scraps at their building's Nama' bin, earn verified points, and redeem them for local grocery, bakery and café rewards.

# Architectural Rules
- Always use modular, clean, and well-typed code (TypeScript strict mode).
- Do not write mock data where real API/database hooks should go; use clean separation of concerns.
- Check existing files before creating new ones to avoid duplicate components.
- Keep components small (<150 lines where possible) and reusable.

# Development Workflow
- **Plan Mode First:** Before writing or changing code for any feature, enter Plan Mode and outline the approach. Wait for my confirmation before executing large file creations.
- **Incremental Steps:** Build and test one feature at a time. Do not try to generate the entire app in a single prompt.
- **Error Handling:** Always wrap async calls in try/catch blocks and provide clear user-facing fallback states (loading/error spinners).
- **Styling:** Use Tailwind CSS following a mobile-first responsive design.

# Verification & Testing
- After writing a feature, tell me how I can test or verify it locally.
- Run type-checks / linting (`npm run lint` or `tsc`) and fix any errors before finishing a task.

# Project map
- `app/(tabs)/` — Home, Rewards, Impact, Guide screens sharing the bottom `components/TabBar.tsx`
- `app/scan/` — bin scanning flow
- `components/ui/` — shared building blocks (Button, List, Segmented, Sheet, Icon, Bits)
- `components/brand/Logo.tsx` — bilingual Nama' | نماء logo
- `app/globals.css` — design tokens (light + dark); use the Tailwind colour names (`bg-ground`, `bg-card`, `text-ink`, `text-muted`, `bg-forest`, `bg-lime`…)
- `lib/` — data and helpers

# Build roadmap
1. Scaffold, design system, tab bar, Sorting Guide ✅
2. Supabase schema + accounts (sign up / log in / profile)
3. Home (points, streak, pickup, recent drops)
4. Scan + pending deposit
5. Staff verification (points only after verification)
6. Rewards + redemption
7. Impact (building totals, leaderboard, badges)
8. PWA install + deploy
