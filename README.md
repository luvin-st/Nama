# Nama' (نماء)

Community food-waste collection and rewards app for Dubai apartment buildings. Built for our IEN startup project.

## First-time setup

You need [Node.js 20 or newer](https://nodejs.org) and a free [Supabase](https://supabase.com) project.

1. **Database.** In Supabase, open **SQL Editor → New query**, paste the contents of `supabase/migrations/0001_init.sql` and click **Run**. Then do the same with `supabase/seed.sql`.
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

See the roadmap in `CLAUDE.md`. Features 1–2 are done: the design system, Sorting Guide, accounts and profile.
