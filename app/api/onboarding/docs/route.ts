import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth-helpers"
import { type OnboardingApiResponse, type VerificationDocument } from "@/lib/types"
import { z } from 'zod'
import { generateSecureUploadUrl, validateFileUpload } from '@/lib/storage'

const documentUploadSchema = z.object({
  document_type: z.enum(['identity_card', 'passport', 'business_license', 'tax_certificate']),
  file_name: z.string().min(1, 'File name is required'),
  file_size: z.number().positive('File size must be positive'),
  mime_type: z.string().min(1, 'MIME type is required')
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get current user
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Authentication required" },
        { status: 401 }
      )
    }

    // Check if user's email is verified before allowing document submission
    const { data: emailVerification, error: verificationError } = await supabase
      .from('email_verifications')
      .select('verified')
      .eq('user_id', user.id)
      .eq('verified', true)
      .single()

    if (verificationError || !emailVerification) {
      return NextResponse.json(
        { 
          ok: false, 
          error: "Email verification required before document submission",
          requiresEmailVerification: true
        },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { documents } = body // Array of document upload requests
    
    if (!Array.isArray(documents) || documents.length === 0) {
      return NextResponse.json(
        { 
          ok: false, 
          error: "Documents array is required",
          fieldErrors: { documents: ["At least one document is required"] }
        },
        { status: 400 }
      )
    }

    // Validate each document
    const validatedDocuments = []
    for (let i = 0; i < documents.length; i++) {
      const validation = documentUploadSchema.safeParse(documents[i])
      if (!validation.success) {
        return NextResponse.json(
          { 
            ok: false, 
            error: `Invalid document data at index ${i}`,
            fieldErrors: validation.error.flatten().fieldErrors 
          },
          { status: 400 }
        )
      }
      validatedDocuments.push(validation.data)
    }

    // Get or create verification request
    let verificationRequest
    const { data: existingRequest, error: requestError } = await supabase
      .from('verification_requests')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'draft')
      .single()

    if (requestError && requestError.code !== 'PGRST116') {
      console.error('Error fetching verification request:', requestError)
      return NextResponse.json(
        { ok: false, error: "Failed to fetch verification request" },
        { status: 500 }
      )
    }

    if (existingRequest) {
      verificationRequest = existingRequest
    } else {
      // Create new verification request
      const { data: newRequest, error: createError } = await supabase
        .from('verification_requests')
        .insert({
          user_id: user.id,
          role: 'influencer', // Default role, can be updated later
          status: 'draft',
        })
        .select()
        .single()

      if (createError) {
        console.error('Error creating verification request:', createError)
        return NextResponse.json(
          { ok: false, error: "Failed to create verification request" },
          { status: 500 }
        )
      }
      verificationRequest = newRequest
    }

    // Create document records and generate pre-signed URLs
    const documentResults = []
    
    for (const doc of validatedDocuments) {
      // Validate file upload
      const validation = validateFileUpload(doc.file_name, doc.file_size, doc.mime_type)
      if (!validation.valid) {
        return NextResponse.json(
          { 
            ok: false, 
            error: validation.error
          },
          { status: 400 }
        )
      }

      // Get file extension
      const fileExtension = doc.file_name.toLowerCase().substring(doc.file_name.lastIndexOf('.') + 1)

      // Generate secure upload URL with short TTL
      const uploadResult = await generateSecureUploadUrl(user.id, doc.document_type, fileExtension)
      
      if (!uploadResult.success) {
        return NextResponse.json(
          { 
            ok: false, 
            error: uploadResult.error
          },
          { status: 500 }
        )
      }

      const documentId = crypto.randomUUID()
      const storagePath = `kyc/${user.id}/${documentId}-${doc.file_name}`
      
      // Create document record
      const { data: documentRecord, error: docError } = await supabase
        .from('verification_documents')
        .insert({
          id: documentId,
          request_id: verificationRequest.id,
          doc_type: doc.document_type,
          storage_path: storagePath,
          mime_type: doc.mime_type,
          size_bytes: doc.file_size,
          status: 'pending',
        })
        .select()
        .single()

      if (docError) {
        console.error('Error creating document record:', docError)
        return NextResponse.json(
          { 
            ok: false, 
            error: "Failed to create document record"
          },
          { status: 500 }
        )
      }

      documentResults.push({
        id: documentId,
        doc_type: doc.document_type,
        upload_url: uploadResult.uploadUrl,
        storage_path: storagePath,
        expires_in: 900, // 15 minutes
      })
    }

    return NextResponse.json({
      ok: true,
      data: {
        verification_request_id: verificationRequest.id,
        documents: documentResults,
      },
      message: "Document upload URLs generated successfully"
    } as OnboardingApiResponse)
  } catch (error) {
    console.error('Document upload preparation error:', error)
    return NextResponse.json(
      { 
        ok: false, 
        error: "Something went wrong"
      },
      { status: 500 }
    )
  }
}
