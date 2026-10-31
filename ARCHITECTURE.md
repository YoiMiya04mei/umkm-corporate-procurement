# SYSTEM ARCHITECTURE: UMKM CORPORATE PROFILE & PROCUREMENT PLATFORM

## 1. Executive Summary

This architecture document specifies the technical design, structure, and operational standards for the **UMKM Corporate Profile & Procurement (Supplier & Service Provider)** web platform. The platform is designed to provide enterprise-grade B2B/B2G credibility, showcasing products and services, handling Request for Quotations (RFQ), publishing company insights, and offering a robust Content Management System (Admin CMS) for managing all business data.

---

## 2. Technology Stack

### Frontend & Core Framework
- **Framework**: Next.js (App Router, React 19 / 18, TypeScript)
- **Styling**: Tailwind CSS with custom corporate design system
- **UI Components**: Modern shadcn/ui inspired primitives, custom corporate components
- **Icons**: Lucide React
- **Client State & Forms**: React Hook Form / Native Server Actions with Zod schemas

### Backend & Database
- **Runtime**: Node.js v24 LTS
- **Server Paradigm**: Next.js Server Actions & Route Handlers (RESTful JSON APIs)
- **ORM**: Prisma ORM
- **Database**: PostgreSQL (Production & Docker) / SQLite (Local zero-config dev/test option)
- **Data Validation**: Zod (Schema validation on both client and server)
- **Authentication**: Custom secure Session Cookie (HTTP-only, SameSite=Lax/Strict) with `bcryptjs` password hashing

### Storage & Uploads
- **Storage Layer**: Modular Storage Provider (`LocalStorageProvider` for dev/standalone, with interface ready for S3 / MinIO / R2)
- **Allowed Document Types**: PDF, DOCX, XLSX, ZIP, JPG, PNG, WEBP
- **Security**: MIME validation, file size limit (10MB), random UUID filename sanitization

### Deployment & DevOps
- **Containerization**: Multi-stage Dockerfile (Optimized Next.js standalone build)
- **Orchestration**: `docker-compose.yml` with PostgreSQL 16 Alpine container, health checks, and data volumes

---

## 3. Brand Identity & Design System

### Color Palette
| Token | Hex Value | Purpose |
|---|---|---|
| **Primary Navy** | `#101D32` | Header, Hero, Deep corporate backgrounds, Footers |
| **Corporate Blue** | `#183B63` | Primary buttons, active tabs, secondary headers |
| **Accent Gold** | `#C8A96B` | Highlighting badges, accents, premium borders, CTAs |
| **White** | `#FFFFFF` | Card backgrounds, text on dark, clean content space |
| **Light Gray** | `#F4F6F9` | Section alternating backgrounds, subtle borders, input fields |
| **Text Dark** | `#1E293B` | High-contrast body typography |
| **Text Muted** | `#64748B` | Secondary details, metadata, captions |

### Design Principles
1. **Corporate Elegance**: Sharp borders, 8px/12px border radiuses, subtle drop shadows, authoritative typography.
2. **Clarity & Transparency**: Distinct distinction between Product procurement and Service offerings.
3. **Frictionless RFQ**: Quick access to quotation requests from anywhere (navigation bar, product pages, service pages, and dedicated `/rfq` page).
4. **Mobile First & Responsive**: Optimized for desktop procurement managers and mobile decision-makers.

---

## 4. Application Architecture & Folder Structure

```
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── prisma/
│   ├── schema.prisma            # Prisma database schema
│   ├── schema.postgresql.prisma # Dedicated Postgres schema
│   └── seed.ts                  # Database seeder with demo corporate data
├── public/
│   ├── uploads/                 # Local media storage directory
│   ├── images/                  # Static business illustrations & placeholders
│   └── favicon.ico
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (public)/            # Public-facing route group
│   │   │   ├── layout.tsx       # Public header, navigation, footer, WhatsApp float
│   │   │   ├── page.tsx         # Homepage
│   │   │   ├── tentang-kami/    # About Us page
│   │   │   ├── produk/          # Product catalog & search
│   │   │   │   └── [slug]/      # Product detail page
│   │   │   ├── layanan/         # Services catalog
│   │   │   │   └── [slug]/      # Service detail page
│   │   │   ├── portofolio/      # Project portfolio & filters
│   │   │   │   └── [slug]/      # Portfolio detail page
│   │   │   ├── artikel/         # Blog & news articles
│   │   │   │   └── [slug]/      # Article detail page
│   │   │   ├── kontak/          # Contact page with interactive form
│   │   │   ├── rfq/             # Request for Quotation main form
│   │   │   │   └── sukses/      # RFQ confirmation & WhatsApp follow-up
│   │   │   ├── sitemap.ts       # Dynamic sitemap generation
│   │   │   └── robots.ts        # Robots.txt crawler directives
│   │   ├── admin/               # Admin CMS route group
│   │   │   ├── login/           # Admin login page
│   │   │   ├── layout.tsx       # Admin sidebar, topbar, auth guard
│   │   │   ├── page.tsx         # Dashboard metrics & recent activities
│   │   │   ├── products/        # Product CRUD
│   │   │   ├── services/        # Service CRUD
│   │   │   ├── portfolio/       # Portfolio CRUD
│   │   │   ├── articles/        # Blog CRUD
│   │   │   ├── categories/      # Category management
│   │   │   ├── rfq/             # RFQ workflow & detail view
│   │   │   └── settings/        # Company profile, legalities, stats & SEO
│   │   └── api/                 # API Routes
│   │       ├── auth/            # Login, logout, session check
│   │       ├── upload/          # Secure file upload handler
│   │       ├── rfq/             # RFQ submission endpoint
│   │       ├── contact/         # Contact inquiry endpoint
│   │       └── admin/           # Administrative REST endpoints
│   ├── components/              # Reusable UI Components
│   │   ├── public/              # Public layout & section components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── BusinessCategories.tsx
│   │   │   ├── FeaturedProducts.tsx
│   │   │   ├── ServiceGrid.tsx
│   │   │   ├── StatsSection.tsx
│   │   │   ├── WhyChooseUs.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── WhatsAppFloatingButton.tsx
│   │   │   └── RfqModal.tsx
│   │   ├── admin/               # Admin dashboard components
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── AdminHeader.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── DataTable.tsx
│   │   │   └── MediaUploader.tsx
│   │   └── ui/                  # Primitives (Button, Input, Modal, Badge, etc.)
│   ├── lib/                     # Core utilities & services
│   │   ├── prisma.ts            # Prisma client singleton
│   │   ├── auth.ts              # Session creation, verification, password hashing
│   │   ├── storage.ts           # File upload storage abstraction
│   │   ├── utils.ts             # Formatting, currency, date, slugify helpers
│   │   ├── validations.ts       # Zod validation schemas
│   │   └── constants.ts         # Enums, statuses, default configurations
│   └── types/                   # TypeScript interfaces & types
└── README.md
```

---

## 5. Database Schema Design (Prisma)

### Key Entities
1. **User**: Administrator credentials, email, password hash, role (`ADMIN`, `STAFF`), full name.
2. **CompanySetting**: Key-value or unified single-record store for company profile:
   - Name, Legal Name (`PT/CV ...`), Tagline, Logo, Favicon, Description, Vision, Mission.
   - Address, City, Postal Code, Phone, WhatsApp, Email, Business Hours, Google Maps Embed URL.
   - Legalities: NIB, NPWP, Akta Notaris, SK Kemenkumham, Sertifikat Standar / ISO.
   - Social Media links (LinkedIn, Instagram, Facebook, YouTube).
   - Statistics counters: `projectsCompleted`, `clientsCount`, `productsCount`, `yearsOfExperience`.
3. **Category**: Shared or typed categories (`PRODUCT`, `SERVICE`, `PORTFOLIO`, `ARTICLE`) with name, slug, description.
4. **Product**: Title, slug, SKU, brand, categoryId, shortDesc, description, specifications (JSON/key-value), price (optional/nullable), availability (`READY_STOCK`, `INDENT`, `PRE_ORDER`), isFeatured, isPublished, images (JSON array or relation).
5. **Service**: Title, slug, categoryId, shortDesc, description, icon, scopeOfWork (JSON array), processSteps (JSON array), isFeatured, isPublished, images.
6. **Portfolio**: Title, slug, categoryId, clientName, location, completionYear, description, images, isFeatured.
7. **Article**: Title, slug, categoryId, author, thumbnail, excerpt, content (HTML/Markdown), seoTitle, seoDescription, isPublished, publishedAt.
8. **RfqRequest**:
   - `rfqNumber`: Auto-generated unique tracking string, e.g. `RFQ-20261031-0012`
   - `customerName`, `companyName`, `email`, `whatsapp`
   - `requestType`: `BARANG` | `JASA` | `KEDUANYA`
   - `targetItem`: Product/service name or custom description
   - `quantity`: Quantity and units (e.g. "500 Unit", "1 Paket")
   - `specifications`: Detailed requirement text
   - `deliveryLocation`: Destination site or delivery address
   - `targetDate`: Desired completion date
   - `attachmentUrl`: Path to uploaded BoQ/ToR/specification document
   - `status`: `NEW` | `REVIEWED` | `QUOTATION_PREPARED` | `SENT` | `APPROVED` | `REJECTED` | `COMPLETED`
   - `internalNotes`: Administrator comments and pricing notes
   - `createdAt`, `updatedAt`
9. **ContactMessage**: Inbound inquiries from the contact form with name, company, email, phone, subject, message, status (`UNREAD`, `READ`, `REPLIED`).

---

## 6. Security Architecture

1. **Password Security**: Passwords hashed using standard `bcryptjs` with salt rounds = 12.
2. **Session Security**:
   - Encrypted session cookie storing authenticated user token.
   - `HttpOnly`, `SameSite=Lax`, `Secure` in production.
   - Next.js edge-compatible middleware protects `/admin/*` routes, redirecting unauthenticated users to `/admin/login`.
3. **Input Sanitization & Validation**:
   - Strict Zod schemas validating all client inputs on server actions/API routes.
   - Text inputs trimmed, tags escaped where necessary to prevent XSS.
   - Prisma parameterized queries completely prevent SQL injection.
4. **File Upload Hardening**:
   - MIME validation against allowed list.
   - Size limit check (max 10MB per file).
   - Random UUID naming prevents file path traversal (`../`) and filename collisions.
   - Files served through controlled static endpoints or public upload folder.
5. **Rate Limiting**: In-memory rate limiting for sensitive endpoints (Login, Contact submission, RFQ submission).

---

## 7. Performance & SEO Architecture

1. **Next.js Server Components**: High-performance static and server-rendered HTML for search engine crawlers with sub-second First Contentful Paint (FCP).
2. **Dynamic Metadata**: Automatic Open Graph, Twitter Cards, and canonical URLs for every product, service, and article.
3. **Structured Data (JSON-LD)**:
   - `Organization` schema with company address, legal name, phone, logo.
   - `Product` schema for items in the catalog.
   - `Article` schema for industry news.
4. **Core Web Vitals**: Responsive images using `next/image` with WebP format, priority loading for above-the-fold heroes, and zero layout shift.

