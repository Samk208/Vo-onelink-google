'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Product, PaginatedResponse } from '@/lib/types'
import { columns } from './columns'
import { DataTable } from './data-table'
import { Skeleton } from '@/components/ui/skeleton'

// Add a new interface for our page's meta data
export interface ProductPageMeta {
  deleteProduct: (productId: string) => void;
}

export default function SupplierProductsPage() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/products?owner=supplier')

      if (response.status === 401 || response.status === 403) {
        router.push('/sign-in')
        toast({ title: 'Unauthorized', description: 'You do not have permission to access this page.', variant: 'destructive' })
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const result: PaginatedResponse<Product> = await response.json()
      setProducts(result.data || [])
    } catch (error) {
      console.error(error)
      toast({ title: 'Error', description: 'Could not fetch your products.', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthLoading) return

    if (!user) {
      router.push('/sign-in')
      toast({ title: 'Unauthorized', description: 'You must be logged in to view this page.', variant: 'destructive' })
      return
    }

    fetchProducts()
  }, [user, isAuthLoading, router, toast])

  const deleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      toast({ title: 'Success', description: 'Product deleted successfully.' });
      fetchProducts(); // Refetch products after deletion
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Could not delete the product.', variant: 'destructive' });
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Your Products</h1>
        <Button asChild>
          <Link href="/dashboard/supplier/products/new">
            <PlusCircle className="w-4 h-4 mr-2" />
            New Product
          </Link>
        </Button>
      </div>
      {
        isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <DataTable columns={columns} data={products} meta={{ deleteProduct }} />
        )
      }
    </div>
  )
}
