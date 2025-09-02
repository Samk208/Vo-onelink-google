"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

interface ShopFiltersProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  regions: string[]
  selectedRegions: string[]
  onRegionChange: (regions: string[]) => void
  priceRange: [number, number]
  onPriceRangeChange: (range: [number, number]) => void
  inStockOnly: boolean
  onInStockChange: (checked: boolean) => void
  onResetFilters: () => void
  className?: string
}

export function ShopFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  regions,
  selectedRegions,
  onRegionChange,
  priceRange,
  onPriceRangeChange,
  inStockOnly,
  onInStockChange,
  onResetFilters,
  className = "",
}: ShopFiltersProps) {
  const handleRegionChange = (region: string, checked: boolean) => {
    if (region === "All") {
      onRegionChange(checked ? ["All"] : [])
    } else {
      onRegionChange((prev) => {
        const filtered = prev.filter((r) => r !== "All")
        return checked ? [...filtered, region] : filtered.filter((r) => r !== region)
      })
    }
  }

  const handleInStockChange = (checked: boolean | "indeterminate") => {
    onInStockChange(checked === true)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with reset button */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetFilters}
          className="text-gray-500 hover:text-gray-700"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === category
                  ? "bg-indigo-100 text-indigo-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              aria-label={`Filter by ${category} category`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
        <div className="px-3">
          <Slider
            value={priceRange}
            onValueChange={(value) => onPriceRangeChange(value as [number, number])}
            max={300}
            step={10}
            className="mb-3"
            aria-label="Price range slider"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Regions */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Regions</h4>
        <div className="space-y-2">
          {regions.map((region) => (
            <div key={region} className="flex items-center space-x-2">
              <Checkbox
                id={`region-${region}`}
                checked={selectedRegions.includes(region)}
                onCheckedChange={(checked) => handleRegionChange(region, checked === true)}
                aria-label={`Filter by ${region} region`}
              />
              <label
                htmlFor={`region-${region}`}
                className="text-sm text-gray-600 cursor-pointer hover:text-gray-800"
              >
                {region}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Stock Status */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="inStock"
          checked={inStockOnly}
          onCheckedChange={handleInStockChange}
          aria-label="Show only in-stock items"
        />
        <label
          htmlFor="inStock"
          className="text-sm text-gray-600 cursor-pointer hover:text-gray-800"
        >
          In stock only
        </label>
      </div>

      {/* Active Filters Summary */}
      {(selectedCategory !== "All" || 
        (selectedRegions.length > 0 && !selectedRegions.includes("All")) || 
        inStockOnly || 
        priceRange[0] > 0 || 
        priceRange[1] < 300) && (
        <div className="pt-4 border-t">
          <h4 className="font-medium text-gray-900 mb-2">Active Filters</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== "All" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700">
                Category: {selectedCategory}
              </span>
            )}
            {selectedRegions.length > 0 && !selectedRegions.includes("All") && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700">
                Regions: {selectedRegions.join(", ")}
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700">
                In Stock Only
              </span>
            )}
            {(priceRange[0] > 0 || priceRange[1] < 300) && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700">
                Price: ${priceRange[0]} - ${priceRange[1]}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
