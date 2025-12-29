# Reevit Store - TanStack Start + Reevit Example

A premium furniture e-commerce store demo showcasing `@reevit/react` SDK integration with TanStack Start, built with shadcn UI.

## Features

- 🛒 **Product Catalog** - Beautiful grid layout with hover effects
- 🛍️ **Shopping Cart** - Quantity controls and summary
- 💳 **Checkout** - Complete purchases with ReevitCheckout widget
- ⚡ **TanStack Start** - Type-safe file-based routing with SSR
- 🎨 **Shadcn UI** - Vega theme with orange accents
- 📱 **Responsive** - Works on all devices

## Tech Stack

- **Framework**: TanStack Start (React 19)
- **Routing**: TanStack Router
- **UI**: Shadcn UI (Vega theme)
- **Icons**: Hugeicons
- **Styling**: Tailwind CSS v4
- **Payments**: `@reevit/react` SDK

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

App runs at `http://localhost:3001`

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
VITE_REEVIT_PUBLIC_KEY=pfk_test_xxx
VITE_REEVIT_BASE_URL=http://localhost:8080
```

## License

MIT
