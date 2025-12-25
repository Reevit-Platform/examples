# TechShop - React + Reevit Example

A demo e-commerce store showcasing the `@reevit/react` SDK integration. This example demonstrates how to integrate the Reevit payment widget into a React application.

## Features

- 🛒 **Product Catalog** - Browse and add products to cart
- 🛍️ **Shopping Cart** - Manage cart items with quantity controls
- 💳 **Checkout** - Complete purchases using the `ReevitCheckout` widget
- 🔄 **Payment Status** - Real-time payment status tracking with polling

## Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: TailwindCSS v4
- **State Management**: React Context (cart), TanStack Query (server state)
- **Payments**: `@reevit/react` SDK

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Running Reevit backend (default: `http://localhost:8080`)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3002`.

### Environment Variables

Create a `.env.local` file:

```bash
VITE_REEVIT_PUBLIC_KEY=pk_test_your_public_key_here
VITE_REEVIT_BASE_URL=http://localhost:8080
```

## Integration Guide

### Using ReevitCheckout

The `ReevitCheckout` component provides a complete checkout experience:

```tsx
import { ReevitCheckout } from '@reevit/react';

function CheckoutPage() {
  return (
    <ReevitCheckout
      publicKey="pk_test_xxx"
      amount={15000} // Amount in smallest unit (pesewas)
      currency="GHS"
      email="customer@example.com"
      paymentMethods={['card', 'mobile_money']}
      onSuccess={(result) => {
        console.log('Payment successful:', result);
      }}
      onError={(error) => {
        console.error('Payment failed:', error);
      }}
      theme={{
        primaryColor: '#6366f1',
        darkMode: true,
      }}
    >
      <button>Pay Now</button>
    </ReevitCheckout>
  );
}
```

### Payment Methods

| Method | Countries | Description |
|--------|-----------|-------------|
| `card` | All | Visa, Mastercard |
| `mobile_money` | Ghana | MTN, Vodafone, AirtelTigo |

### Supported Countries

| Country | Code | Currency |
|---------|------|----------|
| Ghana | GH | GHS |
| Nigeria | NG | NGN |
| Kenya | KE | KES |

## Project Structure

```
react+reevit/
├── src/
│   ├── components/       # UI components
│   ├── contexts/         # React contexts (Cart)
│   ├── lib/              # Utilities (products, api)
│   ├── pages/            # Route pages
│   ├── App.tsx           # Main app with router
│   └── main.tsx          # Entry point
├── index.html
└── package.json
```

## Learn More

- [Reevit Documentation](https://docs.reevit.io)
- [@reevit/react SDK](../../sdks/react/README.md)
- [React Documentation](https://react.dev)

## License

MIT
