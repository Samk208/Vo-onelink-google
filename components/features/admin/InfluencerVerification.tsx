"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { CheckCircle, XCircle, Clock, AlertTriangle, Eye, UserCheck } from "lucide-react"
import type { InfluencerProfile } from "@/lib/types"

interface InfluencerVerificationProps {
  influencers: InfluencerProfile[]
  onVerify: (id: string, status: "approved" | "rejected", reason?: string) => Promise<void>
  className?: string
}

export function InfluencerVerification({ influencers, onVerify, className = "" }: InfluencerVerificationProps) {
  const [selectedInfluencer, setSelectedInfluencer] = useState<InfluencerProfile | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const pendingInfluencers = influencers.filter(i => i.verificationStatus === "pending")
  const approvedInfluencers = influencers.filter(i => i.verificationStatus === "approved")
  const rejectedInfluencers = influencers.filter(i => i.verificationStatus === "rejected")

  const handleVerify = async (id: string, status: "approved" | "rejected") => {
    setIsProcessing(true)
    try {
      if (status === "rejected" && !rejectionReason.trim()) {
        toast.error("Please provide a reason for rejection")
        return
      }

      await onVerify(id, status, status === "rejected" ? rejectionReason : undefined)
      setSelectedInfluencer(null)
      setRejectionReason("")
      toast.success(`Influencer ${status} successfully`)
    } catch (error) {
      toast.error("Failed to update verification status")
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "pending":
        return <Clock className="h-5 w-5 text-amber-600" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800">Pending</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const renderInfluencerCard = (influencer: InfluencerProfile) => (
    <Card key={influencer.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <img
            src={influencer.avatar || "/placeholder.svg"}
            alt={influencer.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium text-gray-900">{influencer.name}</h3>
              {getStatusBadge(influencer.verificationStatus)}
            </div>
            <p className="text-sm text-gray-600 mb-1">@{influencer.handle}</p>
            <p className="text-sm text-gray-600 mb-2">{influencer.email}</p>
            <p className="text-sm text-gray-700 line-clamp-2">{influencer.bio}</p>
            
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
              <span>{influencer.followers} followers</span>
              <span>Joined {new Date(influencer.createdAt).toLocaleDateString()}</span>
            </div>

            {influencer.verificationStatus === "pending" && (
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  onClick={() => setSelectedInfluencer(influencer)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Review
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Influencer Verification</h2>
          <p className="text-gray-600">Review and verify influencer accounts</p>
        </div>
        <div className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-indigo-600" />
          <span className="text-sm text-gray-600">
            {pendingInfluencers.length} pending verification
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{pendingInfluencers.length}</p>
                <p className="text-sm text-gray-600">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{approvedInfluencers.length}</p>
                <p className="text-sm text-gray-600">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{rejectedInfluencers.length}</p>
                <p className="text-sm text-gray-600">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Verifications */}
      {pendingInfluencers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-600" />
              Pending Verifications ({pendingInfluencers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingInfluencers.map(renderInfluencerCard)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approved Influencers */}
      {approvedInfluencers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Approved Influencers ({approvedInfluencers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {approvedInfluencers.map(renderInfluencerCard)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rejected Influencers */}
      {rejectedInfluencers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Rejected Influencers ({rejectedInfluencers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rejectedInfluencers.map(renderInfluencerCard)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Modal */}
      {selectedInfluencer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle>Review Influencer: {selectedInfluencer.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={selectedInfluencer.avatar || "/placeholder.svg"}
                  alt={selectedInfluencer.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-lg">{selectedInfluencer.name}</h3>
                  <p className="text-gray-600">@{selectedInfluencer.handle}</p>
                  <p className="text-gray-600">{selectedInfluencer.email}</p>
                  <p className="text-gray-700 mt-2">{selectedInfluencer.bio}</p>
                  
                  <div className="mt-3">
                    <h4 className="font-medium text-gray-900 mb-2">Social Media Links</h4>
                    <div className="space-y-1 text-sm">
                      {Object.entries(selectedInfluencer.socialLinks).map(([platform, url]) => {
                        if (!url) return null
                        return (
                          <div key={platform} className="flex items-center gap-2">
                            <span className="capitalize text-gray-600">{platform}:</span>
                            <a href={url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                              {url}
                            </a>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Verification Decision</h4>
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleVerify(selectedInfluencer.id, "approved")}
                    disabled={isProcessing}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleVerify(selectedInfluencer.id, "rejected")}
                    disabled={isProcessing}
                    variant="destructive"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedInfluencer(null)}
                    disabled={isProcessing}
                  >
                    Cancel
                  </Button>
                </div>

                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-700">Rejection Reason (if rejecting)</label>
                  <Textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please provide a reason for rejection..."
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
