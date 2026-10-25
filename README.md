# MAFT MARKETING — Furniture Hardware Catalogue (Frontend)

A complete, frontend-only React website for **MAFT MARKETING** (Manjeri, Malappuram, Kerala) — a
furniture hardware, sofa accessories and upholstery-supplies business.

Public customers browse the catalogue, add items to a cart, and send the cart as a **WhatsApp
enquiry**. An **admin dashboard** manages products, variants, colours, sizes and categories.

> This is a **frontend demo**. There is no backend, database, real auth or payment. All data is
> seeded from the MAFT catalogue and persisted in the browser via `localStorage`. The service layer
> is structured so mock data can later be swapped for real REST APIs.

## Tech stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** (theme via CSS variables)
- **Zustand** for state (data, cart, auth, toasts)
- **React Router** for routing
- **lucide-react** icons
- No backend — `localStorage` persistence with a reseed-on-version-change strategy

## Getting started

```bash
npm install
npm run dev      # start dev server (Vite)
npm run build    # typecheck + production build
npm run preview  # preview the production build
```

Then open the printed local URL (default http://localhost:5173).

## Admin demo login

- URL: `/admin`
- Email: `admin@maftmarketing.com`
- Password: `Admin@123`

> Authentication is a browser-only demo (`localStorage`) and is **not real security**. Replace
> `src/stores/useAuth.ts` with a real server-side flow before production.

## Routes

**Public:** `/` · `/products` · `/products/:slug` · `/cart` · `/about` · `/contact`

**Admin:** `/admin/login` · `/admin/dashboard` · `/admin/products` · `/admin/products/new` ·
`/admin/products/:id/edit` · `/admin/categories` · `/admin/colours` · `/admin/sizes` ·
`/admin/inquiries` · `/admin/settings`

## Key features

- **Catalogue** — search, multi-filter (category, colour, size, availability, featured/new), sorting
  and client-side pagination.
- **Variants** — products can have no variants, size only, colour only, or both. The product page
  and quick-add modal show only available combinations and respect per-variant stock.
- **Cart** — different size/colour combinations are separate line items; same variant merges
  quantities; persists across refresh.
- **WhatsApp ordering** — a checkout form builds a formatted enquiry and opens
  `https://wa.me/<number>?text=…`. The cart is **not** cleared and no order is marked as placed —
  the customer reviews and sends the message themselves.
- **Admin product form** — variant combination generator with editable SKU/stock/active per
  variant, inline "Add New Colour" (incl. two-tone finishes), specifications and visibility settings.
- **Masters** — Colour, Size and Category CRUD with usage counts and referential-integrity guards.
- **Settings** — business info, WhatsApp number, catalogue options and **Reset Demo Data**.

## Catalogue data

All **198 items** from the MAFT MARKETING PDF catalogue are seeded (names, finishes, sizes, packing
and specs) in [`src/data/seed.ts`](src/data/seed.ts). Product photos could not be extracted from the
PDF, so cards show **clearly-identified placeholders** (initials + category icon) — swap
[`src/components/ui/ProductImage.tsx`](src/components/ui/ProductImage.tsx) for real `<img>` tags when
photos are available. **Prices are intentionally omitted** (the catalogue has none) and stock
quantities are fictional demo values.

## Project structure

```
src/
  components/   ui/ · public/ · admin/
  pages/        public/ · admin/
  stores/       useData · useCart · useAuth · useToast
  lib/          whatsapp · catalogue · useVariantSelection · storage · utils
  data/         seed.ts (198 products + categories, colours, sizes)
  types/        TypeScript models
```

To start fresh, open the admin **Settings → Demo Data → Reset Demo Data**, or clear the browser's
`localStorage` keys prefixed with `maft.`.
