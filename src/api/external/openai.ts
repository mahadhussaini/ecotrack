/**
 * OpenAI API Service
 * Handles all interactions with the OpenAI API
 */

import OpenAI from 'openai'
import { BaseApiClient } from '../base'
import { ApiResponse } from '../types'

interface OpenAIConfig {
  apiKey: string
  model?: string
  timeout?: number
  maxRetries?: number
}

export interface ChatCompletionOptions {
  model?: string
  messages: OpenAI.Chat.ChatCompletionMessageParam[]
  max_tokens?: number
  temperature?: number
  top_p?: number
  frequency_penalty?: number
  presence_penalty?: number
}

export interface CompletionResponse {
  content: string
  usage?: OpenAI.CompletionUsage
  model: string
}

export class OpenAIService extends BaseApiClient {
  private client: OpenAI | null = null
  private defaultModel: string

  constructor(config: OpenAIConfig) {
    super({
      timeout: config.timeout || 60000, // Longer timeout for AI requests
      retries: config.maxRetries || 2, // Fewer retries for AI requests
      baseURL: undefined, // Don't use base URL for OpenAI
    })

    this.defaultModel = config.model || 'gpt-4.1-nano'
    this.initializeClient(config.apiKey)
  }

  /**
   * Validate API key and initialize OpenAI client
   */
  private initializeClient(apiKey: string): void {
    this.validateApiKey(apiKey)

    this.client = new OpenAI({
      apiKey,
      timeout: this.config.timeout,
    })
  }

  /**
   * Validate OpenAI API key format
   */
  private validateApiKey(apiKey: string): void {
    if (!apiKey) {
      throw new Error('OpenAI API key is required')
    }

    if (apiKey.trim().length === 0) {
      throw new Error('OpenAI API key cannot be empty')
    }

    if (!apiKey.startsWith('sk-')) {
      throw new Error('Invalid OpenAI API key format. Key should start with "sk-"')
    }
  }

  /**
   * Create a chat completion
   */
  async createChatCompletion(options: ChatCompletionOptions): Promise<ApiResponse<CompletionResponse>> {
    if (!this.client) {
      return {
        success: false,
        error: {
          code: 'CLIENT_NOT_INITIALIZED',
          message: 'OpenAI client not initialized',
        },
      }
    }

    const startTime = Date.now()
    const requestId = `openai_req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    try {
      this.logger.debug(`[${requestId}] Starting OpenAI chat completion request`)

      const completion = await this.client.chat.completions.create({
        model: options.model || this.defaultModel,
        messages: options.messages,
        max_tokens: options.max_tokens || 1000,
        temperature: options.temperature || 0.7,
        top_p: options.top_p,
        frequency_penalty: options.frequency_penalty,
        presence_penalty: options.presence_penalty,
      })

      const duration = Date.now() - startTime
      this.logger.info(`[${requestId}] OpenAI chat completion completed in ${duration}ms`)

      const response: CompletionResponse = {
        content: completion.choices[0]?.message?.content || '',
        usage: completion.usage,
        model: completion.model,
      }

      return {
        success: true,
        data: response,
        metadata: {
          requestId,
          timestamp: Date.now(),
          duration,
        },
      }
    } catch (error) {
      const duration = Date.now() - startTime
      this.logger.error(`[${requestId}] OpenAI chat completion failed in ${duration}ms:`, error)

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
   * Generate text completion (convenience method)
   */
  async generateCompletion(
    prompt: string,
    options: Partial<ChatCompletionOptions> = {}
  ): Promise<ApiResponse<CompletionResponse>> {
    return this.createChatCompletion({
      messages: [{ role: 'user', content: prompt }],
      ...options,
    })
  }

  /**
   * Generate recommendations based on user data
   */
  async generateRecommendations(
    userActivities: any[],
    userStats: any
  ): Promise<ApiResponse<string[]>> {
    const activitySummary = userActivities.length > 0
      ? userActivities
          .map(activity => `${activity.category}: ${activity.type} (${activity.value || activity.amount || 'N/A'})`)
          .join(', ')
      : 'No recent activities'

    const prompt = `You are an AI assistant helping users become more environmentally conscious. Based on this user's recent activities and stats, provide 3-4 personalized, actionable recommendations for reducing their carbon footprint.

User Stats:
- Total Activities: ${userStats?._count?.activities || 0}
- Current Points: ${userStats?.points || 0}

Recent Activities (last 20):
${activitySummary}

Please provide recommendations that are:
1. Specific and actionable
2. Based on gaps in their current sustainable activities
3. Realistic and achievable
4. Focused on high-impact environmental actions

Return only a JSON array of strings, no additional text or formatting.`

    const response = await this.createChatCompletion({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful environmental sustainability assistant. Always respond with valid JSON arrays of recommendation strings.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error,
      }
    }

    try {
      const recommendations = JSON.parse(response.data.content.trim())

      if (Array.isArray(recommendations) && recommendations.every(rec => typeof rec === 'string')) {
        return {
          success: true,
          data: recommendations.slice(0, 4),
          metadata: response.metadata,
        }
      } else {
        throw new Error('Invalid response format')
      }
    } catch (parseError) {
      return {
        success: false,
        error: {
          code: 'PARSE_ERROR',
          message: 'Failed to parse AI response as JSON',
          details: parseError,
        },
      }
    }
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    return this.client !== null
  }

  /**
   * Get the current model being used
   */
  getCurrentModel(): string {
    return this.defaultModel
  }

  /**
   * Update the default model
   */
  setModel(model: string): void {
    this.defaultModel = model
  }
}
