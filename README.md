# Reevit Examples

Demonstration projects showcasing Reevit SDK integration across popular JavaScript frameworks with unified shadcn UI design.

## Examples

### 1. TanStack Start + Reevit
**Path**: `tanstack-start+reevit/`  
**Port**: 3001

E-commerce demo using TanStack Start (React 19) with file-based routing, shadcn UI Vega theme, and `@reevit/react` SDK integration.

### 2. Next.js + Reevit  
**Path**: `nextjs-reevit/`  
**Port**: 3003

E-commerce demo using Next.js 16 App Router with shadcn UI Vega theme and `@reevit/react` SDK integration.

### 3. Vue + Reevit
**Path**: `vue-reevit/`  
**Port**: 3004

E-commerce demo using Vue 3 Composition API with Vue Router, Pinia state management, shadcn UI, and `@reevit/vue` SDK integration.

## Unified Design

All examples share:
- **Shadcn UI** with Vega theme (zinc base + orange accent)
- **8 furniture products** with consistent styling
- **E-commerce flow**: Products → Cart → Checkout → Payment
- **Hugeicons** for iconography
- **Responsive design** matching furniture store reference

## Quick Start

```bash
# Choose your framework
cd tanstack-start+reevit  # or nextjs-reevit or vue-reevit

# Install dependencies  
pnpm install

# Run dev server
pnpm dev
```

## Environment Variables

Copy `.env.example` to `.env.local` in each example:

```bash
# TanStack Start & Vue
VITE_REEVIT_PUBLIC_KEY=pk_test_xxx
VITE_REEVIT_BASE_URL=http://localhost:8080

# Next.js  
NEXT_PUBLIC_REEVIT_PUBLIC_KEY=pk_test_xxx
NEXT_PUBLIC_REEVIT_BASE_URL=http://localhost:8080
```
