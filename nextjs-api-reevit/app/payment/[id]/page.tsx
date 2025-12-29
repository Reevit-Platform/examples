'use client'

import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { CheckmarkCircle02Icon, ArrowRight02Icon, Home01Icon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function PaymentStatusPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-24 flex items-center justify-center">
      <Card className="max-w-lg w-full text-center">
        <CardContent className="pt-8 pb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your purchase. Your order has been confirmed and is being processed.
          </p>

          <div className="p-4 bg-muted rounded-lg mb-8">
            <p className="text-sm text-muted-foreground mb-1">Payment Reference</p>
            <p className="font-mono text-lg text-primary break-all">{params.id}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="outline" size="lg">
                <HugeiconsIcon icon={Home01Icon} className="mr-2 h-5 w-5" />
                Back to Shop
              </Button>
            </Link>
            <Button size="lg">
              Track Order
              <HugeiconsIcon icon={ArrowRight02Icon} className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
