import { Shield, RotateCcw, Star, Truck, CreditCard, Heart } from "lucide-react"

interface TrustStripProps {
  influencerHandle: string
  className?: string
}

export function TrustStrip({ influencerHandle, className = "" }: TrustStripProps) {
  const trustItems = [
    {
      icon: Shield,
      text: "Secure checkout",
      color: "text-green-600",
    },
    {
      icon: RotateCcw,
      text: "Easy returns",
      color: "text-green-600",
    },
    {
      icon: Star,
      text: `Curated by @${influencerHandle}`,
      color: "text-amber-500",
    },
    {
      icon: Truck,
      text: "Fast shipping",
      color: "text-green-600",
    },
    {
      icon: CreditCard,
      text: "Multiple payment options",
      color: "text-green-600",
    },
    {
      icon: Heart,
      text: "Quality guaranteed",
      color: "text-green-600",
    },
  ]

  return (
    <section className={`bg-white border-b ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
          {trustItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <item.icon className={`h-4 w-4 ${item.color}`} />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
