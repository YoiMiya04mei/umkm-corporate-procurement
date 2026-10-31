# IMPLEMENTATION PLAN: UMKM CORPORATE PROFILE & PROCUREMENT PLATFORM

## Project Goals
Deliver an enterprise-grade, modern, and production-ready corporate website for an Indonesian UMKM supplier and service provider company. The application features a B2B product and service showcase, an interactive Request for Quotation (RFQ) engine with tracking, and a comprehensive Admin CMS dashboard to manage all corporate details, catalog items, and procurement leads.

---

## Phases & Milestones

### Phase 0: Project Audit & Foundation
- [x] Check environment, Node.js version, and available tooling.
- [x] Create `ARCHITECTURE.md`.
- [x] Create `IMPLEMENTATION_PLAN.md`.

### Phase 1: Project Setup & Design System
- [ ] Initialize Next.js project with TypeScript, Tailwind CSS, and App Router.
- [ ] Configure Tailwind theme with specified corporate color palette:
  - Dark Navy: `#101D32`
  - Corporate Blue: `#183B63`
  - Gold Accent: `#C8A96B`
  - White: `#FFFFFF`
  - Light Gray: `#F4F6F9`
- [ ] Install essential packages:
  - `lucide-react` (corporate iconography)
  - `@prisma/client`, `prisma` (database ORM)
  - `bcryptjs`, `@types/bcryptjs` (password hashing)
  - `jsonwebtoken` / cookie session management
  - `zod` (validation schemas)
- [ ] Configure Prisma schema supporting both PostgreSQL & SQLite development mode.
- [ ] Setup database seed script with realistic Indonesian UMKM demo data tagged with `[DEMO]`.
- [ ] Build UI base component library (Buttons, Badges, Modals, Inputs, Cards).

### Phase 2: Public Website Implementation
- [ ] **Global Header & Navigation**:
  - Sticky header with corporate navy tone and gold accents.
  - Desktop nav menu + mobile hamburger drawer.
  - Direct "Hubungi Kami" & "Minta Penawaran" buttons.
- [ ] **Home Page (`/`)**:
  - Hero Section with value proposition, quick RFQ & catalog buttons.
  - Company Introduction & core competence highlights.
  - Dynamic Business Category Cards (Pengadaan Barang, Supplier, General Trading, IT & Networking, Electrical & Mechanical, General Services).
  - Featured Products slider/grid with specs preview & RFQ trigger.
  - Services Overview with scope indicators.
  - Why Choose Us (6 pillars of B2B/B2G excellence).
  - Dynamic Company Statistics counters (editable via CMS).
  - Recent Portfolio showcase.
  - Clients & Partners logo carousel.
  - Testimonials section.
  - Latest Articles & Industry Insights.
  - Global CTA banner & Corporate Footer.
- [ ] **About Us Page (`/tentang-kami`)**:
  - History, vision, mission, and company core values.
  - Service excellence commitment.
  - Organization structure preview.
  - Legalities section (NIB, NPWP, Akta, SK, Sertifikasi) with configurable placeholders.
  - Office & facility photo showcase.
- [ ] **Product Catalog (`/produk` & `/produk/[slug]`)**:
  - Search by keyword, filter by category, sort by name or recent.
  - Product Card with stock badge, brand, SKU, and RFQ action.
  - Product Detail: Image gallery, full specs table, inquiry/RFQ trigger, related products.
- [ ] **Services (`/layanan` & `/layanan/[slug]`)**:
  - Categorized service offerings.
  - Detail page: Scope of work, step-by-step process flowchart, benefits, documentation gallery.
- [ ] **Portfolio (`/portofolio` & `/portofolio/[slug]`)**:
  - Category filtered grid (IT, Mechanical, Construction, General Supply).
  - Project detail with client name, location, completion year, scope, and gallery.
- [ ] **Blog / Articles (`/artikel` & `/artikel/[slug]`)**:
  - Industry news and procurement tips.
  - Article detail with author, published date, read time, SEO tags.
- [ ] **Contact Us (`/kontak`)**:
  - Corporate office address, interactive Google Maps embed, phone, WhatsApp direct click, working hours.
  - Validated contact inquiry form with feedback notifications.
- [ ] **Request for Quotation (`/rfq`)**:
  - Dedicated RFQ procurement form.
  - Automatic RFQ code generation (`RFQ-YYYYMMDD-XXXX`).
  - File upload for BoQ / ToR / Specifications.
  - Confirmation page with WhatsApp follow-up link pre-filled with RFQ code.
- [ ] **Floating Action Elements**:
  - Sticky WhatsApp chat button with quick message.

### Phase 3: Backend API, File Uploads & Database Operations
- [ ] Database client singleton (`prisma.ts`).
- [ ] File upload API (`/api/upload`) with MIME validation, file size limit, and UUID naming.
- [ ] RFQ submission API & validation.
- [ ] Contact form submission API.
- [ ] Admin CRUD endpoints / Server actions for:
  - Products
  - Services
  - Portfolio items
  - Articles
  - Categories
  - RFQ workflow status updates & internal notes
  - Company settings & stats

### Phase 4: Admin Dashboard / CMS (`/admin`)
- [ ] Admin Login (`/admin/login`) with secure authentication and password verification.
- [ ] Session cookie management and auth middleware for `/admin/*`.
- [ ] Admin Layout with sidebar navigation, active route styling, top bar, and logout.
- [ ] **Dashboard Overview (`/admin`)**:
  - Metric cards (Total Products, Services, Portfolio, Articles, Total RFQ, New RFQs).
  - Recent RFQ table with status badges and quick action buttons.
- [ ] **Product Management (`/admin/products`)**:
  - Product table with search and category filter.
  - Create / Edit modal or page with image uploader, dynamic key-value specifications builder, availability toggle, and pricing options.
  - Delete with confirmation.
- [ ] **Service Management (`/admin/services`)**:
  - Service table, Create/Edit forms with scope of work item list and process steps.
- [ ] **Portfolio Management (`/admin/portfolio`)**:
  - Project table, Create/Edit with client name, year, location, and photos.
- [ ] **Article Management (`/admin/articles`)**:
  - Article table, Create/Edit with thumbnail uploader, markdown/rich content, SEO title, and meta description.
- [ ] **Category Management (`/admin/categories`)**:
  - Manage categories across Products, Services, Portfolio, and Articles.
- [ ] **RFQ Management (`/admin/rfq`)**:
  - Filter by status (`NEW`, `REVIEWED`, `QUOTATION_PREPARED`, `SENT`, `APPROVED`, `REJECTED`, `COMPLETED`).
  - RFQ detail view with all customer specifications and downloadable document attachment.
  - Status update dropdown and internal notes editor.
- [ ] **Company & Website Settings (`/admin/settings`)**:
  - General info: Name, legal name, tagline, description, logo, favicon.
  - Contact info: Address, phone, WhatsApp, email, Google Maps embed URL, operational hours.
  - Vision & Mission.
  - Legalities: NIB, NPWP, Akta Notaris, SK Kemenkumham, Sertifikat Standar.
  - Statistics: Custom numbers for projects, clients, products, and years of experience.
  - Social media links.

### Phase 5: Security, SEO & Performance
- [ ] Route protection via middleware for all `/admin/*` routes.
- [ ] Input validation using Zod schemas for all forms.
- [ ] XSS and injection prevention.
- [ ] Rate limiting on sensitive endpoints.
- [ ] Dynamic metadata, Open Graph, and Twitter Cards.
- [ ] Schema.org JSON-LD structured data for `Organization` and `Product`.
- [ ] Dynamic `sitemap.xml` and `robots.txt`.
- [ ] Image optimization and responsive design verification across viewports.

### Phase 6: Verification, Testing & Deployment Readiness
- [ ] Run automated tests verifying CRUD, Auth, RFQ submission, and file uploads.
- [ ] Verify database persistence.
- [ ] Test all links, buttons, modals, and responsive mobile layouts.
- [ ] Execute production build (`npm run build`) and verify zero errors.
- [ ] Prepare Dockerfile and `docker-compose.yml` for PostgreSQL deployment.
- [ ] Write comprehensive `README.md` with setup, environment configuration, and administration instructions.
