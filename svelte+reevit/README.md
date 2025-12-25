# TechShop - Svelte + Reevit Example

A demo e-commerce store showcasing the `@reevit/svelte` SDK integration. This example demonstrates how to integrate the Reevit payment widget into a Svelte 5 application.

## Features

- 🛒 **Product Catalog** - Browse and add products to cart
- 🛍️ **Shopping Cart** - Manage cart items with Svelte 5 runes
- 💳 **Checkout** - Complete purchases using the `ReevitCheckout` component
- 🔄 **Payment Status** - Real-time payment status tracking

## Tech Stack

- **Framework**: Svelte 5 + Vite + TypeScript
- **Styling**: TailwindCSS v4
- **State Management**: Svelte 5 Runes ($state, $derived, $effect)
- **Payments**: `@reevit/svelte` SDK

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3004`.

## Integration Guide

### Using ReevitCheckout

```svelte
<script lang="ts">
  import { ReevitCheckout } from '@reevit/svelte'

  function handleSuccess(event: CustomEvent) {
    console.log('Payment successful:', event.detail)
  }
</script>

<ReevitCheckout
  publicKey="pk_test_xxx"
  amount={15000}
  currency="GHS"
  email="customer@example.com"
  paymentMethods={['card', 'mobile_money']}
  theme={{ primaryColor: '#6366f1', darkMode: true }}
  on:success={handleSuccess}
  on:error={handleError}
>
  <button>Pay Now</button>
</ReevitCheckout>
```

## Project Structure

```
svelte+reevit/
├── src/
│   ├── components/       # Svelte components
│   ├── lib/              # Utilities and stores
│   ├── routes/           # Page components
│   ├── App.svelte        # Main app with router
│   └── main.ts           # Entry point
└── package.json
```

## Learn More

- [Reevit Documentation](https://docs.reevit.io)
- [@reevit/svelte SDK](../../sdks/svelte/README.md)
- [Svelte 5 Documentation](https://svelte.dev)

## License

MIT
