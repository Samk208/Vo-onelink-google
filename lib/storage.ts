import { createServerSupabaseClient } from "@/lib/supabase"

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
  path?: string
}

export interface StorageConfig {
  bucket: string
  folder?: string
  maxSize?: number
  allowedTypes?: string[]
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  file: File,
  config: StorageConfig
): Promise<UploadResult> {
  try {
    const supabase = createServerSupabaseClient()
    
    // Validate file size
    if (config.maxSize && file.size > config.maxSize) {
      return {
        success: false,
        error: `File size exceeds ${config.maxSize / 1024 / 1024}MB limit`
      }
    }

    // Validate file type
    if (config.allowedTypes && !config.allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: `File type ${file.type} not allowed`
      }
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop()
    const fileName = `${timestamp}_${randomString}.${fileExtension}`
    
    // Construct file path
    const filePath = config.folder 
      ? `${config.folder}/${fileName}`
      : fileName

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(config.bucket)
      .upload(filePath, file)

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(config.bucket)
      .getPublicUrl(filePath)

    return {
      success: true,
      url: urlData.publicUrl,
      path: filePath
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(
  bucket: string,
  path: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerSupabaseClient()
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed'
    }
  }
}

/**
 * Get signed URL for private files
 */
export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn: number = 3600
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const supabase = createServerSupabaseClient()
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn)

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      url: data.signedUrl
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get signed URL'
    }
  }
}

/**
 * List files in a storage bucket folder
 */
export async function listFiles(
  bucket: string,
  folder?: string,
  limit: number = 100
): Promise<{ success: boolean; files?: any[]; error?: string }> {
  try {
    const supabase = createServerSupabaseClient()
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder, {
        limit,
        sortBy: { column: 'created_at', order: 'desc' }
      })

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      files: data
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list files'
    }
  }
}

/**
 * Generate a secure upload URL for client-side uploads
 */
export async function generateSecureUploadUrl(
  bucket: string,
  path: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<{ url: string; error?: string }> {
  try {
    const supabase = createServerSupabaseClient()
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(path, {
        upsert: false
      })

    if (error) {
      return { url: '', error: error.message }
    }

    return { url: data.signedUrl }
  } catch (error) {
    return { 
      url: '', 
      error: error instanceof Error ? error.message : 'Failed to generate upload URL' 
    }
  }
}

/**
 * Validate file upload based on size, type, and other criteria
 */
export function validateFileUpload(
  file: File,
  options: {
    maxSize?: number
    allowedTypes?: string[]
    maxDimensions?: { width: number; height: number }
  } = {}
): { valid: boolean; error?: string } {
  const { maxSize = 10 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'] } = options

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`
    }
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} not allowed. Allowed types: ${allowedTypes.join(', ')}`
    }
  }

  return { valid: true }
}

// Common storage configurations
export const STORAGE_CONFIGS = {
  documents: {
    bucket: 'documents',
    folder: 'onboarding',
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
  },
  products: {
    bucket: 'products',
    folder: 'images',
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
  },
  avatars: {
    bucket: 'avatars',
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
  }
} as const
