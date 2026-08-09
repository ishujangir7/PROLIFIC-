
# PROLIFIC HUB — Next.js version

This is your original `prolific_hub_terracotta.html` converted into a proper
Next.js project. The UI, styling, and behavior are unchanged — it's the same
app, just restructured so we can wire up a real database, file uploads, and
auth in the steps that follow.

## What changed vs. the original file

- One HTML file → a Next.js project (`app/layout.js`, `app/page.js`, `app/globals.css`, `app/data.js`)
- Page navigation, modals, theme, and saved items now use React state instead of direct DOM manipulation
- Course/lecture/test/material data lives in `app/data.js` — this is the exact
  spot we'll replace with real database queries in Step 2
- Nothing else changed. Same look, same pages, same "Watch Lecture" and
  "Create Course" placeholders.

## Run it locally

You'll need [Node.js](https://nodejs.org) 20+ installed on your computer.

```bash
cd prolific-hub
npm install
npm run dev
```

Open http://localhost:3000 — it should look and behave exactly like the
original file.

## Publish it (put it on GitHub)

```bash
cd prolific-hub
git init
git add .
git commit -m "Convert PROLIFIC HUB to Next.js"
```

Then create a new empty repository on GitHub and push:

```bash
git remote add origin https://github.com/YOUR-USERNAME/prolific-hub.git
git branch -M main
git push -u origin main
```

## Deploy on Vercel

1. Go to vercel.com and sign in (GitHub login is easiest)
2. Click **New Project** → select your `prolific-hub` repo
3. Leave all settings as default (Vercel auto-detects Next.js) → **Deploy**
4. You'll get a live URL in about a minute, and every future `git push` auto-deploys

## What's next (Step 2 and beyond)

This step got the app into a shape that's ready to build on. Still ahead:

1. **Database** — set up Postgres (Neon or Supabase, both free to start),
   create tables for courses, lectures, and materials
2. **API routes** — `app/api/courses/route.js` etc., so the frontend fetches
   real data instead of `app/data.js`
3. **File storage** — Vercel Blob for PDFs, a dedicated video host
   (Bunny Stream or Cloudflare Stream) for lecture videos
4. **Admin auth** — a real login so only you can create/edit courses and
   upload content, replacing the currently-open Admin page
5. **Wire the admin forms** — "Create Course" and lecture upload actually
   write to the database and storage instead of just closing the modal

We'll do these one at a time, same as this step.
