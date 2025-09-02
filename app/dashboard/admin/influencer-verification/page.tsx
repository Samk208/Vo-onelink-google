"use client"

import { useState, useEffect } from "react"
import { InfluencerVerification } from "@/components/features/admin/InfluencerVerification"
import type { InfluencerProfile } from "@/lib/types"

// Mock data for influencer verification
const mockInfluencers: InfluencerProfile[] = [
  {
    id: "1",
    handle: "sarah_style",
    name: "Sarah Chen",
    email: "sarah@example.com",
    bio: "Fashion and lifestyle influencer sharing my favorite finds and style tips. I curate products I truly love and believe in.",
    avatar: "/fashion-influencer-avatar.png",
    banner: "/fashion-banner.png",
    followers: "125K",
    verified: true,
    verificationStatus: "approved",
    verificationDate: "2024-01-15",
    socialLinks: {
      instagram: "https://instagram.com/sarah_style",
      twitter: "https://twitter.com/sarah_style",
      youtube: "https://youtube.com/@sarahstyle",
      tiktok: "https://tiktok.com/@sarah_style",
    },
    shopSettings: {
      isPublic: true,
      customDomain: "",
      theme: "default",
      primaryColor: "#4F46E5",
      accentColor: "#F59E0B",
    },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    handle: "mike_tech",
    name: "Mike Rodriguez",
    email: "mike@example.com",
    bio: "Tech reviewer and gadget enthusiast. I test and review the latest tech products to help you make informed decisions.",
    avatar: "/placeholder-user.jpg",
    banner: "/placeholder.jpg",
    followers: "89K",
    verified: false,
    verificationStatus: "pending",
    socialLinks: {
      instagram: "https://instagram.com/mike_tech",
      youtube: "https://youtube.com/@miketech",
      tiktok: "https://tiktok.com/@mike_tech",
    },
    shopSettings: {
      isPublic: false,
      customDomain: "",
      theme: "default",
      primaryColor: "#4F46E5",
      accentColor: "#F59E0B",
    },
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "3",
    handle: "emma_beauty",
    name: "Emma Thompson",
    email: "emma@example.com",
    bio: "Beauty and skincare expert. I share honest reviews and recommendations for beauty products that actually work.",
    avatar: "/placeholder-user.jpg",
    banner: "/placeholder.jpg",
    followers: "67K",
    verified: false,
    verificationStatus: "rejected",
    socialLinks: {
      instagram: "https://instagram.com/emma_beauty",
      youtube: "https://youtube.com/@emmabeauty",
    },
    shopSettings: {
      isPublic: false,
      customDomain: "",
      theme: "default",
      primaryColor: "#4F46E5",
      accentColor: "#F59E0B",
    },
    createdAt: "2024-01-05T00:00:00Z",
    updatedAt: "2024-01-12T00:00:00Z",
  },
  {
    id: "4",
    handle: "alex_fitness",
    name: "Alex Johnson",
    email: "alex@example.com",
    bio: "Fitness coach and wellness advocate. I help people achieve their health goals through sustainable lifestyle changes.",
    avatar: "/placeholder-user.jpg",
    banner: "/placeholder.jpg",
    followers: "203K",
    verified: true,
    verificationStatus: "approved",
    verificationDate: "2024-01-08",
    socialLinks: {
      instagram: "https://instagram.com/alex_fitness",
      youtube: "https://youtube.com/@alexfitness",
      facebook: "https://facebook.com/alexfitness",
    },
    shopSettings: {
      isPublic: true,
      customDomain: "",
      theme: "minimal",
      primaryColor: "#10B981",
      accentColor: "#F59E0B",
    },
    createdAt: "2023-12-20T00:00:00Z",
    updatedAt: "2024-01-08T00:00:00Z",
  },
]

export default function InfluencerVerificationPage() {
  const [influencers, setInfluencers] = useState<InfluencerProfile[]>(mockInfluencers)
  const [isLoading, setIsLoading] = useState(false)

  const handleVerify = async (id: string, status: "approved" | "rejected", reason?: string) => {
    setIsLoading(true)
    try {
      // In a real app, this would make an API call
      console.log(`Verifying influencer ${id} with status: ${status}`, reason ? `Reason: ${reason}` : "")
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update local state
      setInfluencers(prev => prev.map(influencer => {
        if (influencer.id === id) {
          return {
            ...influencer,
            verified: status === "approved",
            verificationStatus: status,
            verificationDate: status === "approved" ? new Date().toISOString() : undefined,
            shopSettings: {
              ...influencer.shopSettings,
              isPublic: status === "approved" && influencer.shopSettings.isPublic
            }
          }
        }
        return influencer
      }))
      
      console.log(`Influencer ${id} ${status} successfully`)
    } catch (error) {
      console.error("Verification failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Influencer Verification</h1>
          <p className="text-gray-600 dark:text-gray-400">Review and verify influencer accounts</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <InfluencerVerification
          influencers={influencers}
          onVerify={handleVerify}
        />
      </div>
    </div>
  )
}
