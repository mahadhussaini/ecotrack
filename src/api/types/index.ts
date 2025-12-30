/**
 * API Types and Interfaces
 * Shared types for API integrations
 */

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: ApiError
  metadata?: {
    requestId?: string
    timestamp?: number
    duration?: number
  }
}

export interface ApiError {
  code: string
  message: string
  details?: any
  statusCode?: number
}

export interface ApiConfig {
  baseURL?: string
  timeout?: number
  retries?: number
  retryDelay?: number
  headers?: Record<string, string>
}

export interface RequestOptions extends Partial<ApiConfig> {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: any
  params?: Record<string, any>
  signal?: AbortSignal
}

export interface RetryConfig {
  maxRetries: number
  delay: number
  backoffMultiplier: number
  shouldRetry: (error: any) => boolean
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface Logger {
  debug: (message: string, ...args: any[]) => void
  info: (message: string, ...args: any[]) => void
  warn: (message: string, ...args: any[]) => void
  error: (message: string, ...args: any[]) => void
}
