"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Share2, Instagram, Twitter, Youtube, Facebook } from "lucide-react"

interface SocialLinks {
  instagram?: string
  twitter?: string
  youtube?: string
  facebook?: string
  tiktok?: string
}

interface InfluencerHeroProps {
  influencer: {
    handle: string
    name: string
    bio: string
    avatar: string
    banner: string
    followers: string
    verified: boolean
    socialLinks: SocialLinks
  }
  onShare?: () => void
  onFollow?: () => void
  isFollowing?: boolean
  className?: string
}

export function InfluencerHero({
  influencer,
  onShare,
  onFollow,
  isFollowing = false,
  className = "",
}: InfluencerHeroProps) {
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="h-4 w-4" />
      case "twitter":
        return <Twitter className="h-4 w-4" />
      case "youtube":
        return <Youtube className="h-4 w-4" />
      case "facebook":
        return <Facebook className="h-4 w-4" />
      case "tiktok":
        return <div className="h-4 w-4 bg-black rounded-sm flex items-center justify-center">
          <span className="text-white text-xs font-bold">T</span>
        </div>
      default:
        return null
    }
  }

  const getSocialColor = (platform: string) => {
    switch (platform) {
      case "instagram":
        return "hover:text-pink-600"
      case "twitter":
        return "hover:text-blue-500"
      case "youtube":
        return "hover:text-red-600"
      case "facebook":
        return "hover:text-blue-600"
      case "tiktok":
        return "hover:text-pink-500"
      default:
        return "hover:text-indigo-600"
    }
  }

  return (
    <section className={`relative ${className}`}>
      {/* Banner */}
      <div className="h-48 sm:h-64 bg-gradient-to-r from-indigo-500 to-purple-600 overflow-hidden">
        <Image
          src={influencer.banner || "/placeholder.svg"}
          alt={`${influencer.name} shop banner`}
          fill
          className="object-cover opacity-80"
          priority
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 sm:-mt-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            {/* Avatar */}
            <div className="relative">
              <Image
                src={influencer.avatar || "/placeholder.svg"}
                alt={influencer.name}
                width={120}
                height={120}
                className="rounded-2xl border-4 border-white shadow-lg"
                priority
              />
              {influencer.verified && (
                <div className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full p-1">
                  <Shield className="h-4 w-4 text-white" />
                </div>
              )}
            </div>

            {/* Info Card */}
            <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  {/* Handle and Name */}
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    @{influencer.handle}
                  </h1>
                  <p className="text-lg text-gray-600 mb-2">{influencer.name}</p>
                  
                  {/* Bio */}
                  <p className="text-gray-700 mb-3 leading-relaxed">{influencer.bio}</p>
                  
                  {/* Stats and Social */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-600">
                    <span className="font-medium">{influencer.followers} followers</span>
                    
                    {/* Social Links */}
                    <div className="flex gap-2">
                      {Object.entries(influencer.socialLinks).map(([platform, url]) => {
                        if (!url) return null
                        return (
                          <Link
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`transition-colors duration-200 ${getSocialColor(platform)}`}
                            aria-label={`Visit ${influencer.name}'s ${platform}`}
                          >
                            {getSocialIcon(platform)}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onShare}
                    className="border-gray-200 hover:bg-gray-50"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    size="sm"
                    onClick={onFollow}
                    variant={isFollowing ? "outline" : "default"}
                    className={isFollowing ? "border-indigo-200 text-indigo-700" : "bg-indigo-600 hover:bg-indigo-700"}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
