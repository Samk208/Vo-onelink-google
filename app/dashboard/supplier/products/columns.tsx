'use client'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, ArrowUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/lib/types'
import Link from 'next/link'
import { ProductPageMeta } from './page'

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        const product = row.original
        return (
            <div className="font-medium">{product.title}</div>
        )
    }
  },
  {
    accessorKey: 'price',
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(price)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: 'commission',
    header: () => <div className="text-right">Commission %</div>,
    cell: ({ row }) => {
        const commission = parseFloat(row.getValue('commission'))
        return <div className="text-right">{commission}%</div>
    }
  },
  {
    accessorKey: 'stockCount',
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Inventory
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    cell: ({ row }) => {
        const stock = parseInt(row.getValue('stockCount'))
        const inStock = row.original.inStock
        return <div className={`text-center ${!inStock || stock <= 10 ? 'text-red-500' : ''}`}>{stock}</div>
    }
  },
  {
    accessorKey: 'region',
    header: 'Regions',
    cell: ({ row }) => {
        const regions = row.getValue('region') as string[]
        return (
            <div className="flex flex-wrap gap-1">
                {regions.map(region => (
                    <Badge key={region} variant="secondary">{region}</Badge>
                ))}
            </div>
        )
    }
  },
  {
    accessorKey: 'active',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('active')
      return <Badge variant={isActive ? 'default' : 'outline'}>{isActive ? 'Active' : 'Inactive'}</Badge>
    },
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const product = row.original
      const meta = table.options.meta as ProductPageMeta

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/supplier/products/${product.id}`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-700 focus:bg-red-50"
                  onSelect={(e) => e.preventDefault()} // Prevent menu from closing
                >
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the product "{product.title}".
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => meta.deleteProduct(product.id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
