import { Routes, Route } from 'react-router-dom'
import { Toaster } from './components/ui/Toaster'
import Header from './components/Header'
import Home from './pages/Home'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import PaymentStatus from './pages/PaymentStatus'

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment/:id" element={<PaymentStatus />} />
      </Routes>
      <Toaster />
    </div>
  )
}
