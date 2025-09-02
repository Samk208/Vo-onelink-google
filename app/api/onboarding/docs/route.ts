import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth-helpers"
import { documentUploadSchema } from "@/lib/validators"
import { type OnboardingApiResponse, type VerificationDocument } from "@/lib/types"

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
      const documentId = crypto.randomUUID()
      const storagePath = `kyc/${user.id}/${documentId}-${doc.file_name}`
      
      // Create document record
      const { data: documentRecord, error: docError } = await supabase
        .from('verification_documents')
        .insert({
          id: documentId,
          request_id: verificationRequest.id,
          doc_type: doc.doc_type,
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
          { ok: false, error: "Failed to create document record" },
          { status: 500 }
        )
      }

      // Generate pre-signed upload URL
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('kyc')
        .createSignedUploadUrl(storagePath, {
          upsert: true,
        })

      if (uploadError) {
        console.error('Error creating signed upload URL:', uploadError)
        return NextResponse.json(
          { ok: false, error: "Failed to generate upload URL" },
          { status: 500 }
        )
      }

      documentResults.push({
        id: documentId,
        doc_type: doc.doc_type,
        upload_url: uploadData.signedUrl,
        storage_path: storagePath,
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
      { ok: false, error: "Something went wrong" },
      { status: 500 }
    )
  }
}
