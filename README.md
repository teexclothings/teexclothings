# TEEX CLOTHINGS — PREMIUM MINIMALIST CLOTHING STORE (v1.0.0)

A premium bespoke minimalist clothing web store built with Next.js App Router, TypeScript, Tailwind CSS, and Supabase. Engineered with a strict Black & White high-contrast brand aesthetic, dynamic state-based shipping charges, and a complete secure checkout inquiry flow continuing directly through WhatsApp.

---

## 1. PROJECT OVERVIEW
TEEX Clothings is a luxury clothing brand catalog interface. It leverages server-side pre-fetching to retrieve categories, banners, and products directly from Supabase, maintaining a modular architecture with clean separation of client, server, and administrative concerns. 

This application operates without:
- ❌ Payment gateways
- ❌ Persistent customer carts
- ❌ Customer accounts or login flows
- ❌ Database writes for client purchases

**Checkout Flow**: The client selects product attributes (color, size), enters delivery details (fully cached in client-side `localStorage`), dynamically selects an active shipping region (fetching rates instantly), and completes checkout by generating and redirecting to a pre-filled secure WhatsApp message directed to the store manager.

---

## 2. TECHNOLOGY STACK
- **Framework**: Next.js 16.3.0 (App Router), React 19.2.8
- **Language**: TypeScript 5.5 (Strict Type Checking)
- **Database / Backend**: Supabase PostgreSQL database client interface (`@supabase/supabase-js`)
- **Styling**: Tailwind CSS v4.0 (PostCSS plugin configuration)
- **Iconography**: Lucide React
- **Formatting**: ESLint, Prettier

---

## 3. PROJECT DIRECTORY STRUCTURE
```
Teex Clothings/
├── public/                 # Static public assets (placeholders, brand logo, icons)
├── supabase/               # Backend setup migrations & database configurations
└── src/
    ├── app/                # Page layouts, dynamic routes, routing layouts
    │   ├── (customer)/     # Customer routes (Catalog, product details, philosophy, contact)
    │   ├── admin/          # Secure admin dashboard (Products, categories, settings, shipping)
    │   ├── globals.css     # Global styles, Tailwind v4 design tokens, transitions
    │   ├── layout.tsx      # Core root layout loader (Google Fonts setup)
    │   └── not-found.tsx   # Global 404 handler
    ├── components/         # Reusable layouts, forms, and atomic elements
    │   ├── ui/             # Dialogs, bottom sheets, skeletons, product cards
    │   ├── layout/         # Header and footer navigation shells
    │   └── shared/         # Common inputs (e.g. Media upload loaders)
    ├── hooks/              # Custom React state hooks (useAuth, useToast)
    ├── types/              # Strict TypeScript Database types
    └── utils/              # Client/Server client utilities, WhatsApp msg builders, validation
```

---

## 4. DATABASE ARCHITECTURE
The Supabase database layer is designed for modular, secure data storage. The tables are configured as follows:

1. **`profiles`**: Store user metadata (ID, full name, avatar, email, role).
2. **`categories`**: Dynamic collections (id, name, slug, active status).
3. **`products`**: Inventory catalog (id, title, slug, price, category association, colors, sizes, active, featured, images).
4. **`hero_banners`**: Homepage carousel media (id, title, subtitle, media_url, media_type [image/video], button configs).
5. **`settings`**: Shop configurations (logo, email, phone, whatsapp number, address).
6. **`shipping_charges`**: Dynamic shipping rates based on Indian states (state_name, shipping_charge, is_active).

---

## 5. INSTALLATION & SETUP

### Prerequisites
- Node.js (v18.x or v20.x recommended)
- npm or yarn

### Installation
1. Clone the project and navigate to the root directory:
   ```bash
   cd "Teex Clothings"
   ```
2. Install project dependencies:
   ```bash
   npm install
   ```

### Environment Configuration
Create a `.env.local` file in the root workspace folder:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

### Script Execution Commands
- **Development Server**: `npm run dev`
- **Build Production**: `npm run build`
- **Start Compiled Build**: `npm run start`
- **Code Linter Check**: `npm run lint`

---

## 6. ADMINISTRATIVE ACCESS & SECURITY
- **Admin Section**: Accessible via the path `/admin`.
- **Authentication**: Managed through secure Supabase email/password credentials.
- **RLS (Row Level Security)**:
  - Public reads are permitted on categories, products, banners, settings, and shipping charges.
  - Write permissions require authentication checked via the `is_admin()` server check function.

---

## 7. MAINTENANCE & CONFIGURATION
- **Adding Banners**: Admin panel allows adding banners with local uploads for images or video loops (.mp4 format recommended).
- **Adding States**: The `shipping_charges` dashboard under admin allows adding new shipping zones which appear immediately in the checkout address state dropdown.
- **WhatsApp Configuration**: The phone number to receive messages is updated in real-time through `/admin/settings`. Specify the full number with country code (e.g. `919876543210` for India).

---

## 8. TROUBLESHOOTING
- **Images/Videos Not Loading**: Ensure the domains on which files are hosted are added to `next.config.ts` remote patterns.
- **Local Address Form Cache**: Cleared by deleting browser storage keys or updating `teex_delivery` inside localStorage.
