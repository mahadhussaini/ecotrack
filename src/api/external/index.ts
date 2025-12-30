/**
 * External API Services
 * Provides access to external third-party APIs
 */

import { OpenAIService } from './openai'

/**
 * Create an OpenAI service instance with environment-based configuration
 */
export function createOpenAIService(apiKey?: string) {
  const key = apiKey || process.env.OPENAI_API_KEY

  if (!key) {
    throw new Error('OpenAI API key is required. Set OPENAI_API_KEY environment variable.')
  }

  return new OpenAIService({
    apiKey: key,
    model: 'gpt-4.1-nano', // Default model
    timeout: 60000,
    maxRetries: 2,
  })
}

// Export service classes for direct instantiation
export { OpenAIService }

// Re-export types
export type { ChatCompletionOptions, CompletionResponse } from './openai'
