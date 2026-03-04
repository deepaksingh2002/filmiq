# AI Movie Insight Builder

## Setup Instructions

1. Install dependencies:
```bash
npm install
```
2. Create `.env.local` from `.env.example` and set keys:
```bash
OMDB_API=...
OMDB_API_KEY=...
GEMINI_API_KEY=...
```
3. Start dev server:
```bash
npm run dev
```
4. Production build:
```bash
npm run build
npm run start
```

## Tech Stack Rationale

- **Next.js App Router + TypeScript**: single codebase for pages and API routes with typed architecture.
- **Tailwind CSS**: consistent design system and responsive layout without inline styles.
- **Framer Motion**: card animations, transitions, and cinematic micro-interactions.
- **clsx + tailwind-merge**: safe conditional utility class composition.
- **Axios + Cheerio + Gemini SDK**: existing movie/review/AI logic preserved in `lib/`.

## Assumptions

- IMDb ID input must match `^tt\\d{7,8}$`.
- API keys are only read from environment variables (`.env.local` or Vercel env config).
- `/api/movie` handles movie metadata retrieval and `/api/sentiment` handles AI sentiment analysis.
