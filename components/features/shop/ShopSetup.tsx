"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Upload, Save, Eye, EyeOff, Palette, Globe, Instagram, Twitter, Youtube, Facebook, Edit } from "lucide-react"
import type { InfluencerProfile } from "@/lib/types"

interface ShopSetupProps {
  profile: InfluencerProfile
  onSave: (profile: Partial<InfluencerProfile>) => Promise<void>
  className?: string
}

export function ShopSetup({ profile, onSave, className = "" }: ShopSetupProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: profile.name,
    bio: profile.bio,
    handle: profile.handle,
    socialLinks: { ...profile.socialLinks },
    shopSettings: { ...profile.shopSettings }
  })

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave({
        name: formData.name,
        bio: formData.bio,
        handle: formData.handle,
        socialLinks: formData.socialLinks,
        shopSettings: formData.shopSettings
      })
      setIsEditing(false)
      toast.success("Shop settings saved successfully!")
    } catch (error) {
      toast.error("Failed to save shop settings")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: profile.name,
      bio: profile.bio,
      handle: profile.handle,
      socialLinks: { ...profile.socialLinks },
      shopSettings: { ...profile.shopSettings }
    })
    setIsEditing(false)
  }

  const updateSocialLink = (platform: keyof typeof formData.socialLinks, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }))
  }

  const updateShopSetting = (key: keyof typeof formData.shopSettings, value: any) => {
    setFormData(prev => ({
      ...prev,
      shopSettings: {
        ...prev.shopSettings,
        [key]: value
      }
    }))
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shop Setup</h2>
          <p className="text-gray-600">Customize your shop appearance and settings</p>
        </div>
        <div className="flex items-center gap-3">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Settings
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Verification Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge className={profile.verified ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
              {profile.verified ? "Verified" : "Pending Verification"}
            </Badge>
            Verification Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              {profile.verified 
                ? "Your account is verified and your shop is public. You can start selling products."
                : "Your account is pending verification. Your shop will be public once verified by our team."
              }
            </p>
            {profile.verificationStatus === "rejected" && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  Verification was rejected. Please contact support for more information.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Display Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                disabled={!isEditing}
                placeholder="Your display name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Handle</label>
              <Input
                value={formData.handle}
                onChange={(e) => setFormData(prev => ({ ...prev, handle: e.target.value }))}
                disabled={!isEditing}
                placeholder="@yourhandle"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Bio</label>
            <Textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              disabled={!isEditing}
              placeholder="Tell your followers about yourself..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Media Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Instagram className="h-4 w-4 text-pink-600" />
                Instagram
              </label>
              <Input
                value={formData.socialLinks.instagram || ""}
                onChange={(e) => updateSocialLink("instagram", e.target.value)}
                disabled={!isEditing}
                placeholder="https://instagram.com/yourhandle"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Twitter className="h-4 w-4 text-blue-500" />
                Twitter
              </label>
              <Input
                value={formData.socialLinks.twitter || ""}
                onChange={(e) => updateSocialLink("twitter", e.target.value)}
                disabled={!isEditing}
                placeholder="https://twitter.com/yourhandle"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Youtube className="h-4 w-4 text-red-600" />
                YouTube
              </label>
              <Input
                value={formData.socialLinks.youtube || ""}
                onChange={(e) => updateSocialLink("youtube", e.target.value)}
                disabled={!isEditing}
                placeholder="https://youtube.com/@yourchannel"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <div className="h-4 w-4 bg-black rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs font-bold">T</span>
                </div>
                TikTok
              </label>
              <Input
                value={formData.socialLinks.tiktok || ""}
                onChange={(e) => updateSocialLink("tiktok", e.target.value)}
                disabled={!isEditing}
                placeholder="https://tiktok.com/@yourhandle"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shop Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Shop Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Public Shop</label>
              <p className="text-xs text-gray-500">Make your shop visible to customers</p>
            </div>
            <Switch
              checked={formData.shopSettings.isPublic}
              onCheckedChange={(checked) => updateShopSetting("isPublic", checked)}
              disabled={!isEditing || !profile.verified}
            />
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Theme</label>
              <Select
                value={formData.shopSettings.theme}
                onValueChange={(value) => updateShopSetting("theme", value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Custom Domain</label>
              <Input
                value={formData.shopSettings.customDomain || ""}
                onChange={(e) => updateShopSetting("customDomain", e.target.value)}
                disabled={!isEditing}
                placeholder="shop.yourdomain.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Primary Color</label>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={formData.shopSettings.primaryColor}
                  onChange={(e) => updateShopSetting("primaryColor", e.target.value)}
                  disabled={!isEditing}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={formData.shopSettings.primaryColor}
                  onChange={(e) => updateShopSetting("primaryColor", e.target.value)}
                  disabled={!isEditing}
                  placeholder="#4F46E5"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Accent Color</label>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={formData.shopSettings.accentColor}
                  onChange={(e) => updateShopSetting("accentColor", e.target.value)}
                  disabled={!isEditing}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={formData.shopSettings.accentColor}
                  onChange={(e) => updateShopSetting("accentColor", e.target.value)}
                  disabled={!isEditing}
                  placeholder="#F59E0B"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Shop Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <Eye className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Preview Your Shop</h3>
            <p className="text-gray-600 mb-4">
              See how your shop will look to customers
            </p>
            <Button variant="outline" onClick={() => window.open(`/shop/${profile.handle}`, "_blank")}>
              <Eye className="h-4 w-4 mr-2" />
              View Shop
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
