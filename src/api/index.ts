/**
 * API Integration Layer
 * Centralized server-side API integrations
 */

// Base functionality
export { BaseApiClient } from './base'

// External services
export { createOpenAIService, OpenAIService } from './external'
export type { ChatCompletionOptions, CompletionResponse } from './external'

// Internal API client
export { InternalApiClient } from './internal'

// Types
export type {
  ApiConfig,
  ApiResponse,
  ApiError,
  RequestOptions,
  LogLevel,
  Logger
} from './types'
