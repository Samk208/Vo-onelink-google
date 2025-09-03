import { Suspense } from "react"
import { notFound } from "next/navigation"
import { InfluencerShopClient } from "./InfluencerShopClient"
import { Skeleton } from "@/components/ui/skeleton"

interface PageProps {
  params: Promise<{ handle: string }>
}

// Mock data - in real app, fetch from API based on handle
const getInfluencerData = async (handle: string) => {
  const mockInfluencers = {
    "sarah_style": {
      handle: "sarah_style",
      name: "Sarah Chen",
      bio: "Fashion & lifestyle creator sharing my favorite finds ✨ Sustainable fashion advocate 🌱",
      avatar: "/fashion-influencer-avatar.png",
      banner: "/fashion-banner.png",
      followers: "125K",
      verified: true,
      socialLinks: {
        instagram: "https://instagram.com/sarah_style",
        twitter: "https://twitter.com/sarah_style",
        youtube: "https://youtube.com/@sarahstyle",
      },
    },
    "tech_maven": {
      handle: "tech_maven",
      name: "Alex Rodriguez",
      bio: "Tech reviewer & gadget enthusiast 🔥 Latest reviews and unboxings 📱",
      avatar: "/tech-influencer-avatar.png",
      banner: "/tech-banner.png",
      followers: "89K",
      verified: true,
      socialLinks: {
        instagram: "https://instagram.com/tech_maven",
        twitter: "https://twitter.com/tech_maven",
        youtube: "https://youtube.com/@techmaven",
      },
    },
    "wellness_guru": {
      handle: "wellness_guru",
      name: "Maya Patel",
      bio: "Wellness & fitness journey 🧘‍♀️ Helping you live your best life 💪",
      avatar: "/wellness-influencer-avatar.png",
      banner: "/wellness-banner.png",
      followers: "156K",
      verified: true,
      socialLinks: {
        instagram: "https://instagram.com/wellness_guru",
        twitter: "https://twitter.com/wellness_guru",
        youtube: "https://youtube.com/@wellnessguru",
      },
    },
  }

  return mockInfluencers[handle as keyof typeof mockInfluencers] || null
}

const getMockProducts = (handle: string) => {
  return [
    {
      id: "1",
      title: "Sustainable Cotton Tee",
      price: 45,
      originalPrice: 60,
      image: "/cotton-tee.png",
      badges: ["New", "Eco-Friendly"],
      category: "Clothing",
      region: "Global",
      inStock: true,
      stockCount: 15,
      rating: 4.8,
      reviews: 124,
    },
    {
      id: "2",
      title: "Minimalist Gold Necklace",
      price: 89,
      image: "/gold-necklace.png",
      badges: ["Hot"],
      category: "Jewelry",
      region: "KR",
      inStock: true,
      stockCount: 3,
      rating: 4.9,
      reviews: 67,
    },
    {
      id: "3",
      title: "Organic Skincare Set",
      price: 120,
      originalPrice: 150,
      image: "/skincare-set.png",
      badges: ["Bestseller"],
      category: "Beauty",
      region: "JP",
      inStock: true,
      stockCount: 8,
      rating: 4.7,
      reviews: 203,
    },
    {
      id: "4",
      title: "Vintage Denim Jacket",
      price: 95,
      image: "/classic-denim-jacket.png",
      badges: ["Limited"],
      category: "Clothing",
      region: "Global",
      inStock: true,
      stockCount: 25,
      rating: 4.6,
      reviews: 89,
    },
    {
      id: "5",
      title: "Handcrafted Ceramic Mug",
      price: 28,
      image: "/ceramic-mug.png",
      badges: ["New"],
      category: "Home",
      region: "CN",
      inStock: true,
      stockCount: 12,
      rating: 4.5,
      reviews: 45,
    },
    {
      id: "6",
      title: "Wireless Earbuds Pro",
      price: 199,
      originalPrice: 249,
      image: "/wireless-earbuds.png",
      badges: ["Hot", "Tech"],
      category: "Electronics",
      region: "Global",
      inStock: true,
      stockCount: 7,
      rating: 4.8,
      reviews: 156,
    },
  ]
}

function InfluencerShopSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="relative">
        <Skeleton className="h-64 w-full" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto">
            <div className="flex items-end gap-4">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function InfluencerShopPage({ params }: PageProps) {
  const { handle } = await params
  
  const influencer = await getInfluencerData(handle)
  const products = getMockProducts(handle)

  if (!influencer) {
    notFound()
  }

  return (
    <Suspense fallback={<InfluencerShopSkeleton />}>
      <InfluencerShopClient 
        influencer={influencer}
        products={products}
        handle={handle}
      />
    </Suspense>
  )
}
