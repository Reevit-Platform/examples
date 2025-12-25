# Reevit Store - Vue + Reevit Example

Premium furniture e-commerce store demo using Vue 3 with shadcn UI (Vega theme) and `@reevit/vue` SDK.

## Features

- ⚡ **Vue 3 + Vite** - Modern reactive framework
- 🎨 **Shadcn UI** - Vega theme (zinc + orange)
- 🛒 **E-commerce Flow** - Products → Cart → Checkout
- 💳 **Reevit Payments** - SDK integration
- 🎯 **Hugeicons** - Premium iconography

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server  
pnpm dev
```

App runs at `http://localhost:3004`

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
VITE_REEVIT_PUBLIC_KEY=pk_test_xxx
VITE_REEVIT_BASE_URL=http://localhost:8080
```

## Project Structure

```
src/
├── App.vue             # Root component with router
├── components/         # Reusable Vue components
├── views/             # Page components
├── lib/               # Utilities and state
└── router/            # Vue Router config
```

## Notes

- Uses Vue 3 Composition API
- State management with Pinia
- Same design as TanStack Start and Next.js examples

## License

MIT
