# CalTrack - Personal Calorie Tracker

A mobile-first PWA for tracking daily calories and protein, with weekly summaries and weight tracking. All data stored in localStorage — no backend, no auth.

## Features

- **Today View**: Log food entries with calories and protein, see daily totals and weekly averages
- **Week View**: Mon-Sun breakdown with daily calorie totals, weight tracking
- **History**: Browse past weeks with average calories and weight deltas
- **Day Detail**: Add/delete entries for any day
- **Monday Weigh-in**: Optional weekly weight check-in
- **PWA**: Add to home screen on iOS/Android

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS
- localStorage (all data persisted client-side)

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo
3. Click Deploy — no configuration needed

Or use the CLI:

```bash
npm i -g vercel
vercel
```
