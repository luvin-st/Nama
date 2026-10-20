# Nama' (نماء)

Community food-waste collection and rewards app for Dubai apartment buildings. Built for our IEN startup project.

## First-time setup

You need [Node.js 20 or newer](https://nodejs.org) and a free [Supabase](https://supabase.com) project.

1. **Database.** In Supabase, open **SQL Editor → New query**, paste the contents of `supabase/migrations/0001_init.sql` and click **Run**. Then do the same with `supabase/seed.sql`, then each later migration in number order (`0002_…`, `0003_…`).
2. **Email confirmation (optional, handy for demos).** Go to **Authentication → Sign In / Providers → Email** and turn off **Confirm email**, so new accounts can log in straight away.
3. **App settings.** Copy `.env.example` to `.env.local` and fill in your project URL and publishable key. You can find both under **Project Settings → API**, or the **Connect** button.
4. **Run it:**

   ```bash
   npm install
   npm run dev
   ```

   Open http://localhost:3000. To try it on your phone, connect to the same Wi-Fi and open `http://<your-computer's-IP>:3000`.

## Making someone staff

Staff can verify deposits (from Feature 5). In Supabase, go to **Table Editor → profiles**, find the person and change `role` from `resident` to `staff`.

## Checks

```bash
npm run lint
npx tsc --noEmit
```

## Status

See the roadmap in `CLAUDE.md`. All 8 features are done: design system, Sorting Guide, accounts, Home, bin scanning, staff verification, rewards, the Impact tab, and an installable app (PWA) that runs online on Vercel. Staff open **Profile → Check drops** to weigh drops (20 points per kg) and **Profile → Check vouchers** to mark vouchers used; staff can't check their own. Bin QR stickers are at `/staff/bin-codes` and link to whichever address the app is running on. After pulling a new feature, run any new file in `supabase/migrations/` in the SQL Editor.

## Deploying (Vercel)

1. On [vercel.com](https://vercel.com), sign in with GitHub → **Add New → Project** → import this repository.
2. Under **Environment Variables**, add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (same values as `.env.local`), then **Deploy**.
3. In Supabase → **Authentication → URL Configuration**, set **Site URL** to the Vercel address and add it under **Redirect URLs**.
4. Every push to `main` redeploys automatically. New SQL files in `supabase/migrations/` still need running once in the SQL Editor.

On phones, open the Vercel link and use **Add to Home Screen** (iPhone: Share → Add to Home Screen; Android: **Install Nama'**). The camera scanner works there because the site is https.

The app icons in `public/icons/` are drawn from the logo by `scripts/make-icons.ts` (dev-only; needs Playwright).
