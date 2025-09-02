export enum UserRole {
  SUPPLIER = "supplier",
  INFLUENCER = "influencer",
  CUSTOMER = "customer",
}

export interface AuthResponse {
  ok: boolean
  role?: UserRole
  message?: string
  errors?: Record<string, string>
}

export interface ApiError {
  message: string
  errors?: Record<string, string>
}
