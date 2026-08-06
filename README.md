# TEEX CLOTHINGS — PROJECT FOUNDATION & ARCHITECTURE

A premium minimalist clothing store web application built with Next.js, TypeScript, Tailwind CSS (v4), and Supabase. Optimized for high performance, accessibility, and dynamic content.

---

## 1. PROJECT OVERVIEW
This application is designed specifically for a mobile-first premium clothing brand. The UI features a strictly minimalist Black & White theme, emphasizing typography, high-quality whitespace, and large product images. All business configuration, categories, pricing, and banner contents are managed dynamically from Supabase.

---

## 2. TECHNOLOGY STACK
- **Core**: Next.js 16.3.0 (App Router), React 19.2.8
- **Language**: TypeScript (Strict Compilation Mode)
- **Styling**: Tailwind CSS v4.0 (PostCSS plugin configuration)
- **Database**: Supabase client (`@supabase/supabase-js`)
- **Icons**: Lucide React
- **Formatting & Linting**: ESLint, Prettier (`prettier-plugin-tailwindcss`)

---

## 3. PROJECT DIRECTORY STRUCTURE
```
src/
├── app/                  # Next.js App Router (pages, layouts, loading, errors)
│   ├── favicon.ico       # Website favicon
│   ├── globals.css       # Global styles, Tailwind v4 imports, design tokens
│   ├── layout.tsx        # Global Layout (luxury fonts & SEO metadata initialization)
│   └── page.tsx          # Home page placeholder
├── components/           # Reusable UI & layout components
│   ├── ui/               # Core atomic inputs, buttons, sheets
│   ├── layout/           # Global structures (header, overlay drawers, footer)
│   └── shared/           # Common blocks (e.g., custom elegant loadings, empty states)
├── services/             # Client modules (Supabase client interface, API declarations)
├── hooks/                # Custom React hooks (state management, API helpers)
├── context/              # Global React Context providers
├── utils/                # Pure utility functions (formatting, validation)
├── types/                # Strict TypeScript declaration types
├── constants/            # Immutable settings and static definitions
└── assets/               # Local static images, svgs, local fonts
```

---

## 4. DEVELOPMENT PHILOSOPHY
- **No Hardcoded Data**: Absolutely no hardcoding of sizes, colors, shipping, or hero elements. Everything must be fetched dynamically from Supabase to let the business owner control content via an admin dashboard.
- **Single Responsibility**: Every component must serve one purpose. Keep codebase clean, scalable, and modular.
- **Mobile-First Priority**: The user interface is developed mobile-first, ensuring high responsiveness, finger-friendly hit targets (≥ 48px), and minimal touch latency.

---

## 5. INSTALLATION & SETUP

### Prerequisites
- Node.js (v18.x or v20.x recommended)
- npm or yarn

### Installation
1. Clone the repository and navigate to the project directory:
   ```bash
   cd "Teex Clothings"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Configuration
Create a `.env.local` file in the root directory and add the following keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Script Execution Commands
- **Development Server**: `npm run dev`
- **Build Production**: `npm run build`
- **Start Production**: `npm run start`
- **Code Linter**: `npm run lint`

---

## 6. CODING STANDARDS
- **TypeScript**: Must use strict settings. Never use `any`. Define precise interfaces in `src/types/`.
- **Styling**: Prefer Tailwind CSS classes. Use the design tokens defined in `src/app/globals.css` (e.g., `font-serif-luxury` for headings, `bg-background` and `text-foreground`).
- **Prettier Plugin**: Automatically run Prettier to ensure Tailwind classes are sorted consistently.
- **Naming Conventions**:
  - Folders: lowercase kebab-case (e.g. `components/ui`).
  - Files: PascalCase for components (`Button.tsx`), camelCase for hooks and utils (`useSupabase.ts`).
  - Components: PascalCase (`Button`).
  - Interfaces/Types: PascalCase (`Product`).

---

## 7. NEXT-PHASE ROADMAP
1. **Supabase Client Setup**: Configure the `@supabase/supabase-js` client provider, define TypeScript definitions mapped to database schemas.
2. **Design System & Layout primitives**: Create premium B&W components: Header, Navigation Drawer, Footer, Elegant Button, Custom Input, Drawer Bottom Sheet.
3. **Core Purchasing Flow**: Form layouts, verification, and WhatsApp pre-filled link builder.
