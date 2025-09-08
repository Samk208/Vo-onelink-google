'use client'

import { useEffect } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    googleTranslateElementInit: () => void
    google: any
  }
}

export default function GoogleTranslate() {
  useEffect(() => {
    // Define the initialization function
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            // Korean, Japanese, Chinese (Simplified & Traditional), English
            includedLanguages: 'ko,ja,zh-CN,zh-TW,en',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        )
      }
    }
  }, [])

  return (
    <>
      <div 
        id="google_translate_element" 
        className="inline-block"
      />
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      <style jsx global>{`
        /* Hide Google Translate toolbar */
        .goog-te-banner-frame.skiptranslate {
          display: none !important;
        }
        body {
          top: 0px !important;
        }
        
        /* Style the dropdown */
        .goog-te-combo {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 14px;
          color: #374151;
          cursor: pointer;
        }
        
        /* Hide Google branding */
        .goog-logo-link {
          display: none !important;
        }
        
        .goog-te-gadget {
          color: transparent !important;
        }
        
        .goog-te-gadget .goog-te-combo {
          margin: 0 !important;
        }
      `}</style>
    </>
  )
}
