import type { Metadata } from "next"
import ProductDetailClient from "./ProductDetailClient"

// Mock data for metadata generation
const mockProduct = {
  id: "1",
  title: "Sustainable Cotton Tee",
  description:
    "Made from 100% organic cotton, this comfortable tee is perfect for everyday wear. The soft fabric feels great against your skin while being environmentally conscious.",
  images: ["/cotton-tee.png", "/cotton-tee-back.png", "/cotton-tee-detail.png", "/cotton-tee-model.png"],
}

const mockInfluencer = {
  handle: "sarah_style",
  name: "Sarah Chen",
}

interface ProductDetailPageProps {
  params: {
    handle: string
    id: string
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  // In a real app, you'd fetch the product data here
  const product = mockProduct
  const influencer = mockInfluencer

  return {
    title: `${product.title} | @${influencer.handle} Shop | One-Link`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [
        {
          url: product.images[0],
          width: 800,
          height: 800,
          alt: product.title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.description,
      images: [product.images[0]],
    },
    alternates: {
      canonical: `/shop/${params.handle}/product/${params.id}`,
    },
  }
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  return <ProductDetailClient params={params} />
}
