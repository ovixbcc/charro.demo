# Chaatro.com (ছাত্র.com)

Bangladeshi online e-learning platform: 1-to-1 and 1-to-7 group live classes by top-university teachers.

Static front-end demo (HTML, CSS, vanilla JS). All data is demo data kept in the browser; there is no backend yet.

## Run locally
Open `index.html`, or run `npx serve .`

## Deploy (Vercel)
Import this repo in Vercel: Framework "Other", leave Build Command and Output Directory empty.

## Demo portals
Hub: `/#portal` (student `#s-home`, teacher `#t-home`, admin `#a-home`).

## Before launch
- Remove `noindex` (meta tag in `index.html` and the header in `vercel.json`).
- Add a real backend: database, auth, payments (bKash / SSLCommerz), live-class links.
