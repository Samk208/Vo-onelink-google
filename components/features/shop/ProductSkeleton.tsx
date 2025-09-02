import { Card, CardContent } from "@/components/ui/card"

interface ProductSkeletonProps {
  viewMode?: "grid" | "list"
  className?: string
}

export function ProductSkeleton({ viewMode = "grid", className = "" }: ProductSkeletonProps) {
  if (viewMode === "list") {
    return (
      <Card className={`overflow-hidden border-0 shadow-sm ${className}`}>
        <div className="flex flex-row">
          {/* Image skeleton */}
          <div className="w-24 h-24 bg-gray-200 rounded-lg skeleton flex-shrink-0" />
          
          <CardContent className="p-4 flex-1">
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 skeleton rounded w-3/4" />
              <div className="h-3 bg-gray-200 skeleton rounded w-1/2" />
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 skeleton rounded w-16" />
                <div className="h-4 bg-gray-200 skeleton rounded w-12" />
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    )
  }

  return (
    <Card className={`overflow-hidden border-0 shadow-sm ${className}`}>
      {/* Image skeleton */}
      <div className="aspect-square bg-gray-200 skeleton" />
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 skeleton rounded w-3/4" />
          <div className="h-3 bg-gray-200 skeleton rounded w-2/3" />
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 skeleton rounded w-16" />
            <div className="h-4 bg-gray-200 skeleton rounded w-12" />
          </div>
          <div className="h-3 bg-gray-200 skeleton rounded w-1/3" />
        </div>
      </CardContent>
    </Card>
  )
}

// Add skeleton animation to global CSS
const skeletonStyles = `
  @keyframes skeleton {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  }
  
  .skeleton {
    background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
    background-size: 200px 100%;
    animation: skeleton 1.5s infinite;
  }
`

// Inject styles if not already present
if (typeof document !== "undefined") {
  const styleId = "skeleton-styles"
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style")
    style.id = styleId
    style.textContent = skeletonStyles
    document.head.appendChild(style)
  }
}
