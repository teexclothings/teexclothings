<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Teex Clothings - AI Development Guidelines

## Project Overview

Teex Clothings is a lightweight fashion storefront for a startup t-shirt brand.

This is an MVP focused on conversion, simplicity, and maintainability.

Budget: ₹6,000  
Timeline: 2 Days

The goal is NOT to build a huge e-commerce platform.

The goal is to build a polished, fast, modern storefront with a clean admin panel that can easily grow later.

Always optimize for simplicity over complexity.

---

# Tech Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS v4
- Supabase
- Lucide React
- Server Components whenever possible

---

# Development Philosophy

Think like a senior software engineer with 15+ years of experience.

Before writing code ask yourself:
- Is this really necessary?
- Can this be simpler?
- Can an existing component be reused?
- Will another developer understand this six months later?

Never over-engineer.  
Prefer readability over cleverness.  
Simple code wins.

---

# Architecture

Always keep the project modular.  
Organize by feature rather than dumping everything into one folder.  
Keep components small.

Separate:
- UI
- Business Logic
- Database
- Utilities

Do not mix responsibilities.

---

# Reusable Components

Before creating any new component:  
Search existing components.  
If an existing component can be reused with props, reuse it.  
Do not duplicate UI.

Examples:  
`Button`, `Badge`, `Card`, `Modal`, `Section Title`, `Empty State`, `Loading State`, `Product Card`, `Product Grid`, `Admin Table`, `Input`, `Textarea`, `Select`, `Color Picker`, `Image Upload` should all be reusable.

---

# Keep Components Small

One component should have one responsibility.  
If a component becomes too large, split it.  
Avoid 500+ line components.  
Ideal: 100-200 lines maximum.

---

# TypeScript

- Never use `any`
- Avoid type assertions unless necessary.
- Always create proper interfaces.
- Keep types inside `src/types` whenever reusable.

---

# Styling

- Use Tailwind only.
- Avoid unnecessary custom CSS.
- Keep spacing consistent.
- Use responsive utilities.
- Desktop and mobile must both be considered.

---

# Design Philosophy

The UI should feel like a modern startup brand.
- Minimal.
- Clean.
- Lots of whitespace.
- Large product images.
- Good typography.
- Simple interactions.
- Fast loading.
- Focus on conversion.

---

# Performance

- Prefer Server Components.
- Only use Client Components when required.
- Avoid unnecessary `useEffect`.
- Avoid unnecessary state.
- Avoid unnecessary re-renders.
- Optimize images.
- Lazy load heavy UI.
- Keep bundle size small.

---

# Data Fetching

- Fetch data on the server whenever possible.
- Keep client-side fetching minimal.
- Avoid duplicate requests.
- Cache where appropriate.

---

# Supabase

- Keep queries clean.
- Select only required fields.
- Never fetch unused data.
- Use proper error handling.
- Do not duplicate Supabase logic.
- Create reusable service functions.

---

# Admin Dashboard

The admin panel is intentionally simple.  
Only include:
- Products
- Categories
- Dashboard
- Settings (if needed)

No unnecessary enterprise features. Focus on speed.

---

# Storefront Features

- Homepage
- Products
- Categories
- Product Details
- WhatsApp Order
- Responsive Navigation
- Footer

Nothing more unless requested.

---

# WhatsApp Ordering

- There is no checkout.
- There is no payment gateway.
- Every product should encourage users to contact via WhatsApp.
- Primary CTA: **Order on WhatsApp**
- Optimize every page for inquiry conversion.

---

# Code Quality

Always write self-explanatory code.  
Avoid comments that explain obvious things.  
Instead write code that is readable with meaningful variable and function names.

---

# Folder Rules

- `components/`: Only reusable UI.
- `services/`: Supabase and API logic.
- `utils/`: Pure helper functions.
- `types/`: Shared interfaces.
- `hooks/`: Reusable hooks only.

Do not place random files in the root.

---

# Naming

Use consistent naming:
- `ProductCard`
- `ProductGrid`
- `ProductForm`
- `ProductTable`
- `CategoryCard`
- `CategoryList`
- `AdminSidebar`

Do not use vague names like `Card2`, `NewComponent`, `Temp`, `Final`, `Latest`.

---

# Error Handling

- Handle every async call.
- Return meaningful errors.
- Never silently fail.

---

# Accessibility

- Use semantic HTML.
- Buttons must be buttons (`<button>`).
- Links must be links (`<a>`).
- Inputs require labels.
- Images require `alt` text.
- Keyboard navigation should work.

---

# Mobile First

- Design for mobile first, then scale up.
- The majority of customers will browse using phones.

---

# UI Consistency

Use consistent:
- Spacing
- Rounded Corners
- Typography
- Button Styles
- Card Styles
- Colors

Do not create different versions of the same UI.

---

# Git

- Keep commits focused.
- One feature per commit.
- Avoid mixing unrelated changes.

---

# When Asked to Build Something

Before coding:
1. Understand the requirement.
2. Think about architecture.
3. Reuse existing components.
4. Keep the implementation simple.
5. Then write production-quality code.

---

# Things To Avoid

❌ Over-engineering  
❌ Premature optimization  
❌ Duplicate components  
❌ Duplicate queries  
❌ Massive files  
❌ Magic numbers  
❌ Inline styles  
❌ Hardcoded values  
❌ Deep component nesting  
❌ Unused state  
❌ Unused imports  
❌ Dead code  
❌ TODOs left behind  

---

# Success Criteria

A successful implementation is:
- Easy to read
- Easy to maintain
- Fast
- Responsive
- Reusable
- Minimal
- Modern
- Conversion focused
- Production ready

Every decision should support these goals.

