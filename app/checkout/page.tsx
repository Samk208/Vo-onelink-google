import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const CheckoutPageComponent = dynamic(
  () => import('@/components/shop/checkout-page').then(mod => ({ default: mod.CheckoutPage })),
  {
    loading: () => <CheckoutSkeleton />,
    ssr: false
  }
)

function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-32" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-6">
              <Skeleton className="h-6 w-48 mb-6" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full mt-4" />
              <Skeleton className="h-10 w-full mt-4" />
            </div>

            <div className="bg-white rounded-lg p-6">
              <Skeleton className="h-6 w-48 mb-6" />
              <Skeleton className="h-10 w-full mb-4" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-6">
              <Skeleton className="h-6 w-48 mb-6" />
              <div className="p-4 border rounded-lg">
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </div>

          {/* Order Summary Skeleton */}
          <div className="bg-white rounded-lg p-6 h-fit">
            <Skeleton className="h-6 w-32 mb-6" />
            
            <div className="space-y-4 mb-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="w-12 h-12 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <hr />
              <div className="flex justify-between">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>

            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutPageComponent />
    </Suspense>
  )
}
