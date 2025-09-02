"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Cookie } from "lucide-react"

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem("cookies-accepted")
    if (!hasAccepted) {
      setIsVisible(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem("cookies-accepted", "true")
    setIsVisible(false)
  }

  const declineCookies = () => {
    localStorage.setItem("cookies-accepted", "false")
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3 flex-1">
            <Cookie className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                We use cookies to enhance your experience, analyze site traffic, and personalize content.{" "}
                <Button variant="link" className="p-0 h-auto text-sm text-indigo-600 hover:text-indigo-700" asChild>
                  <a href="/cookies">Learn more about our cookie policy</a>
                </Button>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 flex-shrink-0">
            <Button variant="outline" size="sm" onClick={declineCookies} className="text-sm bg-transparent">
              Decline
            </Button>
            <Button size="sm" onClick={acceptCookies} className="bg-indigo-600 hover:bg-indigo-700 text-sm">
              Accept All
            </Button>
            <Button variant="ghost" size="sm" onClick={declineCookies} className="p-1" aria-label="Close cookie banner">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
