# Daker Hub

Daker Hub is a public hackathon portal that brings discovery, team recruitment, rankings, and submission preparation into one flow.

- Live app: `https://daker-hub-psi.vercel.app`
- Repository: `https://github.com/dydbin/daker-hub`

## Overview

Daker Hub helps participants move from "what should I join?" to "how ready is my submission?" without jumping across separate tools.

The current product combines:

- hackathon discovery and detail pages
- a shared camp board for team recruitment
- leaderboard and personal activity views
- draft submission saving and Judge Preview self-check

## Main Features

- Browse hackathons with status and context-rich detail pages
- Explore open team posts and manage your own recruitment flow
- Check public rankings and your own saved activity
- Save submission drafts and review them through Judge Preview
- Use signup/login for write flows such as favorites, team posts, messages, and saved submissions

## Stack

- Next.js App Router
- Supabase-backed shared state
- Vercel deployment

## Local Development

```bash
npm install --cache /tmp/npm-cache
npm run dev
```

To enable full persistence and authenticated flows locally, configure the required server-side environment variables in your local environment first. Without that configuration, the app may run in a limited demo mode.

Verification:

```bash
bash .ops/verify.sh
```

## Project Docs

- [Final Proposal](./docs/final-proposal.md)
- [Hackathon Overview](./docs/hackathon-overview.md)
- [Evaluation Notes](./docs/hackathon-evaluation.md)
- [Judge Preview Spec](./docs/judge-preview-screen-spec.md)

## Notes

- The current shipping product is the Next.js app under `app/`, `components/`, `lib/`, and `public/`.
- Legacy static prototype files remain in the repo for history only.
