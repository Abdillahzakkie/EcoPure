# EcoPure Cleaning

The marketing, quoting, and booking website for an eco-friendly cleaning company
serving homes and offices.

Status: **design, awaiting build.** This repository holds the approved spec and
the build prompt. No application code exists yet.

## What it does

- Presents the offer: home, six services, how it works, why EcoPure, reviews,
  FAQ, and legal pages.
- Captures a free-quote request, or a booking request with preferred time
  windows. A request arrives as pending; the owner confirms or declines, and the
  customer is emailed. No online payment — the customer pays the cleaner after the
  visit.
- Lets the owner manage requests, set availability, and edit all marketing
  content from an admin area.

## Planned stack

Next.js 16 (App Router), React 19, TypeScript strict, styled-components v6,
MongoDB (Mongoose), Resend, ImageKit, zod, Biome, Vitest, Playwright, pnpm,
deployed on Vercel. The light "Fresh & Friendly" theme uses a warm off-white
ground, a brand green action colour, and a sunny yellow highlight.

## Documents

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — the full architecture, design
  system, data model, flows, and conventions.
- [`docs/CLOUD-BUILD-PROMPT.md`](docs/CLOUD-BUILD-PROMPT.md) — a self-contained
  prompt to build the site in a fresh session.
