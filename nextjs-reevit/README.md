# Reevit Store - Next.js + Reevit Example

Premium furniture e-commerce store demo using Next.js 16 with shadcn UI (Vega theme) and `@reevit/react` SDK.

## Features

- 📱 **Next.js 16 App Router** - Modern React with server components
- 🎨 **Shadcn UI** - Vega theme (zinc + orange)
- 🛒 **E-commerce Flow** - Products → Cart → Checkout
- 💳 **Reevit Payments** - SDK integration
- 🎯 **Hugeicons** - Premium iconography  
- 🚀 **Turbopack** - Fast refresh

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server  
pnpm dev
```

App runs at `http://localhost:3003`

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
NEXT_PUBLIC_REEVIT_PUBLIC_KEY=pk_test_xxx
NEXT_PUBLIC_REEVIT_BASE_URL=http://localhost:8080
```

## Project Structure

```
app/
├── layout.tsx          # Root layout with CartProvider
├── page.tsx            # Home page with product grid
├── cart/               # Cart page  
└── checkout/           # Checkout page

components/
├── Header.tsx          # Navigation header
├── ProductCard.tsx     # Product display card
└── Toaster.tsx         # Toast notifications

lib/
├── products.ts         # Product catalog
└── cart.tsx           # Cart state management
```

## License

MIT
