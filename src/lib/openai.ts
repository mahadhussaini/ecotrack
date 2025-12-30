import OpenAI from 'openai'

/**
 * OpenAI Service Configuration
 * Centralized service for OpenAI API integration with secure environment variable handling
 */

// Environment variable validation
const validateApiKey = (apiKey: string | undefined): string => {
  if (!apiKey) {
    throw new Error(
      'OpenAI API key is missing. Please set the OPENAI_API_KEY environment variable. ' +
      'Check the documentation for setup instructions.'
    )
  }

  if (apiKey.trim().length === 0) {
    throw new Error(
      'OpenAI API key is empty. Please provide a valid API key in the OPENAI_API_KEY environment variable.'
    )
  }

  // Basic validation - OpenAI keys start with 'sk-'
  if (!apiKey.startsWith('sk-')) {
    throw new Error(
      'Invalid OpenAI API key format. API keys should start with "sk-". ' +
      'Please check your OPENAI_API_KEY environment variable.'
    )
  }

  return apiKey.trim()
}

// Get and validate the API key
const getApiKey = (): string => {
  const apiKey = process.env.OPENAI_API_KEY
  return validateApiKey(apiKey)
}

// Initialize OpenAI client with error handling
let openaiClient: OpenAI | null = null

export const getOpenAIClient = (): OpenAI => {
  try {
    if (!openaiClient) {
      const apiKey = getApiKey()
      openaiClient = new OpenAI({
        apiKey,
        // Optional: Add timeout and other configuration
        timeout: 30000, // 30 seconds
      })
    }
    return openaiClient
  } catch (error) {
    console.error('Failed to initialize OpenAI client:', error)
    throw error
  }
}

// Utility function for safe API calls with error handling
export const makeOpenAICall = async <T>(
  apiCall: () => Promise<T>,
  fallback?: T
): Promise<T> => {
  try {
    const client = getOpenAIClient()
    return await apiCall()
  } catch (error) {
    console.error('OpenAI API call failed:', error)

    if (fallback !== undefined) {
      console.warn('Using fallback value due to OpenAI API error')
      return fallback
    }

    throw error
  }
}

// Export types for convenience
export type { OpenAI } from 'openai'
