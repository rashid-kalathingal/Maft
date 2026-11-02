# MAFT MARKETING — Furniture Hardware Catalogue

A full-stack application for **MAFT MARKETING** (Manjeri, Malappuram, Kerala) — a furniture hardware,
sofa accessories and upholstery-supplies business.

Public customers browse the catalogue, add items to a cart, and send the cart as a **WhatsApp
enquiry**. An **admin dashboard** manages products, variants, colours, sizes, categories, and inquiries.

## Project Structure

```
MAFT/
├── frontend/          # React + TypeScript frontend
│   ├── src/
│   ├── public/
│   └── package.json
└── backend/           # Spring Boot + Java backend
    ├── src/
    └── pom.xml
```

## Frontend

### Tech Stack
- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** (theme via CSS variables)
- **Zustand** for state (data, cart, auth, toasts)
- **React Router** for routing
- **lucide-react** icons

### Getting Started (Frontend)

```bash
cd frontend
npm install
npm run dev      # start dev server (Vite)
npm run build    # typecheck + production build
npm run preview  # preview the production build
```

### Admin Demo Login (Frontend-only mode)
- URL: `/admin`
- Email: `admin@maftmarketing.com`
- Password: `Admin@123`

> When backend is enabled (VITE_API_URL set), authentication uses JWT tokens from the Spring Boot API.

### Frontend Routes

**Public:** `/` · `/products` · `/products/:slug` · `/cart` · `/about` · `/contact`

**Admin:** `/admin/login` · `/admin/dashboard` · `/admin/products` · `/admin/products/new` ·
`/admin/products/:id/edit` · `/admin/categories` · `/admin/colours` · `/admin/sizes` ·
`/admin/inquiries` · `/admin/settings`

### Frontend Project Structure

```
frontend/src/
  components/   ui/ · public/ · admin/
  pages/        public/ · admin/
  stores/       useData · useCart · useAuth · useToast
  lib/          whatsapp · catalogue · useVariantSelection · storage · utils
  data/         seed.ts (198 products + categories, colours, sizes)
  types/        TypeScript models
  services/     api.ts (REST client)
```

## Backend

### Tech Stack
- **Spring Boot 3.3.5** + **Java 17**
- **Spring Data JPA** with H2 (dev) / MySQL (production) / PostgreSQL (Supabase)
- **Spring Security** with JWT authentication
- **Maven** for build management

### Getting Started (Backend)

```bash
cd backend
# Build with Maven wrapper (if available) or with installed Maven
mvn clean install
mvn spring-boot:run
```

The backend runs on `http://localhost:8080` by default.

### Backend Configuration

- H2 Console: `http://localhost:8080/h2-console` (dev only)
- Default admin credentials (seeded on first run):
  - Email: `admin@maftmarketing.com`
  - Password: `Admin@123`

### Database Profiles

**Default (H2 In-Memory):**
- No setup required
- Data persists only while the application is running

**MySQL Profile:**
```bash
export SPRING_PROFILES_ACTIVE=mysql
export DB_URL=jdbc:mysql://localhost:3306/maft?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
export DB_USERNAME=root
export DB_PASSWORD=your_password
```

**Supabase PostgreSQL Profile:**
```bash
export SPRING_PROFILES_ACTIVE=supabase
export DB_URL=jdbc:postgresql://aws-0-eu-west-1.pooler.supabase.com:5432/postgres
export DB_USERNAME=postgres.phrkdfhccivjpogbrdom
export DB_PASSWORD=your_supabase_password
```

### Backend API Endpoints

**Public:**
- `GET /api/products` - List all products
- `GET /api/products/{idOrSlug}` - Get product by id or slug
- `GET /api/categories` - List categories
- `GET /api/colours` - List colours
- `GET /api/sizes` - List sizes
- `GET /api/settings` - Get app settings
- `POST /api/inquiries` - Submit inquiry (cart checkout)
- `POST /api/auth/login` - Admin login

**Admin (requires JWT):**
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `POST /api/categories` - Create category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category
- `POST /api/colours` - Create colour
- `PUT /api/colours/{id}` - Update colour
- `DELETE /api/colours/{id}` - Delete colour
- `POST /api/sizes` - Create size
- `PUT /api/sizes/{id}` - Update size
- `DELETE /api/sizes/{id}` - Delete size
- `GET /api/inquiries` - List all inquiries
- `PUT /api/inquiries/{id}` - Update inquiry status/notes
- `DELETE /api/inquiries/{id}` - Delete inquiry
- `PUT /api/settings` - Update app settings
- `POST /api/uploads` - Upload image

### Enabling Backend Integration

To connect the frontend to the backend, set `VITE_API_URL` in the frontend:

```bash
cd frontend
# Create .env file
echo "VITE_API_URL=http://localhost:8080" > .env
npm run dev
```

When `VITE_API_URL` is set, the frontend will:
- Use JWT authentication instead of localStorage demo
- Persist data to the backend instead of localStorage
- Submit inquiries to the backend on cart checkout

## Key Features

- **Catalogue** — search, multi-filter (category, colour, size, availability, featured/new), sorting
  and client-side pagination.
- **Variants** — products can have no variants, size only, colour only, or both. The product page
  and quick-add modal show only available combinations and respect per-variant stock.
- **Cart** — different size/colour combinations are separate line items; same variant merges
  quantities; persists across refresh.
- **WhatsApp ordering** — a checkout form builds a formatted enquiry and opens
  `https://wa.me/<number>?text=…`. The cart is **not** cleared and no order is marked as placed —
  the customer reviews and sends the message themselves.
- **Inquiry Management** — Admin can view, update status, add notes, and delete customer inquiries.
- **Admin product form** — variant combination generator with editable SKU/stock/active per
  variant, inline "Add New Colour" (incl. two-tone finishes), specifications and visibility settings.
- **Masters** — Colour, Size and Category CRUD with usage counts and referential-integrity guards.
- **Settings** — business info, WhatsApp number, catalogue options and **Reset Demo Data**.

## Catalogue Data

All **198 items** from the MAFT MARKETING PDF catalogue are seeded (names, finishes, sizes, packing
and specs) in [`frontend/src/data/seed.ts`](frontend/src/data/seed.ts) and
[`backend/src/main/resources/seed/products.json`](backend/src/main/resources/seed/products.json).

Product photos could not be extracted from the PDF, so cards show **clearly-identified placeholders**
(initials + category icon) — swap [`frontend/src/components/ui/ProductImage.tsx`](frontend/src/components/ui/ProductImage.tsx)
for real `<img>` tags when photos are available. **Prices are intentionally omitted** (the catalogue has none)
and stock quantities are fictional demo values.

## Demo Mode

To run in frontend-only demo mode (localStorage persistence):
1. Do not set `VITE_API_URL`
2. The app will use seeded data from `frontend/src/data/seed.ts`
3. Authentication uses demo credentials in localStorage

To reset demo data, open the admin **Settings → Demo Data → Reset Demo Data**, or clear the browser's
`localStorage` keys prefixed with `maft.`.
