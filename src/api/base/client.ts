/**
 * Base API Client
 * Provides common functionality for API integrations including error handling, retries, and logging
 */

import { ApiConfig, ApiResponse, ApiError, RequestOptions, RetryConfig, Logger } from '../types'

export class BaseApiClient {
  protected config: ApiConfig
  protected retryConfig: RetryConfig
  protected logger: Logger

  constructor(config: ApiConfig = {}, logger?: Logger) {
    this.config = {
      timeout: 30000,
      retries: 3,
      retryDelay: 1000,
      ...config,
    }

    this.retryConfig = {
      maxRetries: this.config.retries || 3,
      delay: this.config.retryDelay || 1000,
      backoffMultiplier: 2,
      shouldRetry: this.defaultRetryCondition,
    }

    this.logger = logger || this.defaultLogger
  }

  /**
   * Make a request with automatic retries and error handling
   */
  protected async request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const startTime = Date.now()
    const requestId = this.generateRequestId()

    try {
      this.logger.debug(`[${requestId}] Starting request to ${endpoint}`, options)

      let lastError: any

      for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
        try {
          const result = await this.makeRequest<T>(endpoint, options, requestId)
          const duration = Date.now() - startTime

          this.logger.info(`[${requestId}] Request completed successfully in ${duration}ms`)

          return {
            success: true,
            data: result,
            metadata: {
              requestId,
              timestamp: Date.now(),
              duration,
            },
          }
        } catch (error) {
          lastError = error

          if (attempt < this.retryConfig.maxRetries && this.retryConfig.shouldRetry(error)) {
            const delay = this.retryConfig.delay * Math.pow(this.retryConfig.backoffMultiplier, attempt)
            const errorMessage = error instanceof Error ? error.message : String(error)
            this.logger.warn(`[${requestId}] Request failed (attempt ${attempt + 1}/${this.retryConfig.maxRetries + 1}), retrying in ${delay}ms:`, errorMessage)
            await this.sleep(delay)
            continue
          }

          break
        }
      }

      const duration = Date.now() - startTime
      this.logger.error(`[${requestId}] Request failed after ${this.retryConfig.maxRetries + 1} attempts in ${duration}ms:`, lastError)

      return {
        success: false,
        error: this.normalizeError(lastError),
        metadata: {
          requestId,
          timestamp: Date.now(),
          duration,
        },
      }
    } catch (error) {
      const duration = Date.now() - startTime
      this.logger.error(`[${requestId}] Unexpected error in ${duration}ms:`, error)

      return {
        success: false,
        error: this.normalizeError(error),
        metadata: {
          requestId,
          timestamp: Date.now(),
          duration,
        },
      }
    }
  }

  /**
   * Make the actual HTTP request
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestOptions,
    requestId: string
  ): Promise<T> {
    const url = this.buildUrl(endpoint, options.params)

    const requestOptions: RequestInit = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
        ...options.headers,
      },
      signal: options.signal,
    }

    if (options.body && typeof options.body === 'object') {
      requestOptions.body = JSON.stringify(options.body)
    } else if (options.body) {
      requestOptions.body = options.body
    }

    // Add timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || this.config.timeout)

    if (requestOptions.signal) {
      // If there's already a signal, we need to handle both
      const originalSignal = requestOptions.signal
      requestOptions.signal = controller.signal

      originalSignal.addEventListener('abort', () => controller.abort())
    } else {
      requestOptions.signal = controller.signal
    }

    try {
      this.logger.debug(`[${requestId}] Making ${requestOptions.method} request to ${url}`)

      const response = await fetch(url, requestOptions)
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      } else {
        return (await response.text()) as T
      }
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  /**
   * Build full URL with query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const baseUrl = this.config.baseURL || ''
    const url = new URL(endpoint, baseUrl)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    return url.toString()
  }

  /**
   * Default retry condition
   */
  private defaultRetryCondition(error: unknown): boolean {
    // Retry on network errors, timeouts, and 5xx server errors
    if (error instanceof Error) {
      if (error.name === 'AbortError') return true // Timeout
      if (error.message?.includes('fetch')) return true // Network error
      if (error.message?.includes('HTTP 5')) return true // Server error
    }
    return false
  }

  /**
   * Normalize error to ApiError format
   */
  protected normalizeError(error: any): ApiError {
    if (error instanceof Error) {
      return {
        code: error.name,
        message: error.message,
        details: error,
      }
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
      details: error,
    }
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Sleep utility for retries
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Default logger implementation
   */
  private defaultLogger: Logger = {
    debug: (message: string, ...args: any[]) => {
      if (process.env.NODE_ENV === 'development') {
        console.debug(`[API] ${message}`, ...args)
      }
    },
    info: (message: string, ...args: any[]) => {
      console.info(`[API] ${message}`, ...args)
    },
    warn: (message: string, ...args: any[]) => {
      console.warn(`[API] ${message}`, ...args)
    },
    error: (message: string, ...args: any[]) => {
      console.error(`[API] ${message}`, ...args)
    },
  }
}
