import { InfluencerShopClient } from "./InfluencerShopClient"

export default async function InfluencerShopPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  
  // Mock data - in real app, fetch from API
  const mockInfluencer = {
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
  }

  const mockProducts = [
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

  if (!mockInfluencer) {
    return <div>Influencer not found</div>
  }

  return (
    <InfluencerShopClient 
      influencer={mockInfluencer}
      products={mockProducts}
      handle={handle}
    />
  )
}
