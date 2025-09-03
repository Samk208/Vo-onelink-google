import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/lib/types'

interface UseProductsParams {
  category?: string
  search?: string
  supplierId?: string
  limit?: number
  page?: number
}

interface UseProductsReturn {
  products: Product[]
  loading: boolean
  error: string | null
  hasMore: boolean
  totalCount: number
  refetch: () => void
  fetchMore: () => void
}

export function useProducts(params: UseProductsParams = {}): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const { category, search, supplierId, limit = 12 } = params

  const fetchProducts = async (page: number = 1, append: boolean = false) => {
    try {
      setLoading(true)
      setError(null)

      const offset = (page - 1) * limit

      // Build query
      let query = supabase
        .from('products')
        .select(`
          *,
          users!products_supplier_id_fkey (
            id,
            name,
            email,
            verified
          )
        `, { count: 'exact' })
        .eq('active', true)
        .eq('in_stock', true)
        .order('created_at', { ascending: false })

      // Apply filters
      if (category) {
        query = query.eq('category', category)
      }
      if (supplierId) {
        query = query.eq('supplier_id', supplierId)
      }
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,tags.cs.{${search}}`)
      }

      // Apply pagination
      query = query.range(offset, offset + limit - 1)

      const { data, error, count } = await query

      if (error) throw error

      const newProducts = data || []
      
      if (append) {
        setProducts(prev => [...prev, ...newProducts])
      } else {
        setProducts(newProducts)
      }

      setTotalCount(count || 0)
      setHasMore(newProducts.length === limit && (offset + limit) < (count || 0))
      setCurrentPage(page)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    setCurrentPage(1)
    fetchProducts(1, false)
  }

  const fetchMore = () => {
    if (hasMore && !loading) {
      fetchProducts(currentPage + 1, true)
    }
  }

  useEffect(() => {
    fetchProducts(1, false)
  }, [category, search, supplierId, limit])

  return {
    products,
    loading,
    error,
    hasMore,
    totalCount,
    refetch,
    fetchMore
  }
}

export function useProduct(productId: string | null) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!productId) {
      setProduct(null)
      setLoading(false)
      return
    }

    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            users!products_supplier_id_fkey (
              id,
              name,
              email,
              verified,
              avatar_url
            )
          `)
          .eq('id', productId)
          .eq('active', true)
          .single()

        if (error) throw error
        setProduct(data)
      } catch (err) {
        console.error('Error fetching product:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  return { product, loading, error }
}

export function useCategories() {
  const [categories, setCategories] = useState<Array<{ name: string; count: number }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('category')
          .eq('active', true)
          .eq('in_stock', true)

        if (error) throw error

        // Count categories
        const categoryCount = data.reduce((acc: Record<string, number>, item) => {
          acc[item.category] = (acc[item.category] || 0) + 1
          return acc
        }, {})

        const sortedCategories = Object.entries(categoryCount)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)

        setCategories(sortedCategories)
      } catch (err) {
        console.error('Error fetching categories:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading }
}
