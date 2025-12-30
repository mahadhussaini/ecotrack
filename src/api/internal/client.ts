/**
 * Internal API Client
 * For calling our own API endpoints from server-side code
 */

import { BaseApiClient } from '../base'
import { ApiResponse } from '../types'

interface InternalApiConfig {
  baseURL?: string
  timeout?: number
  headers?: Record<string, string>
}

export class InternalApiClient extends BaseApiClient {
  constructor(config: InternalApiConfig = {}) {
    super({
      baseURL: config.baseURL || process.env.NEXTAUTH_URL || 'http://localhost:3000',
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    })
  }

  /**
   * Call our own API endpoints
   */
  async callApi<T = any>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
      body?: any
      params?: Record<string, any>
      headers?: Record<string, string>
    } = {}
  ): Promise<ApiResponse<T>> {
    const fullEndpoint = `/api${endpoint.startsWith('/') ? '' : '/'}${endpoint}`

    return this.request<T>(fullEndpoint, {
      method: options.method || 'GET',
      body: options.body,
      params: options.params,
      headers: options.headers,
    })
  }

  /**
   * Get recommendations for a user
   */
  async getRecommendations(userId?: string): Promise<ApiResponse<any>> {
    return this.callApi('/recommendations', {
      method: 'GET',
      headers: userId ? { 'X-User-ID': userId } : undefined,
    })
  }

  /**
   * Get user activities
   */
  async getActivities(userId: string, options?: {
    take?: number
    skip?: number
    category?: string
  }): Promise<ApiResponse<any>> {
    return this.callApi('/activities', {
      method: 'GET',
      params: {
        userId,
        ...options,
      },
    })
  }

  /**
   * Get leaderboard data
   */
  async getLeaderboard(type: 'global' | 'friends' = 'global'): Promise<ApiResponse<any>> {
    return this.callApi(`/leaderboard${type === 'friends' ? '/friends' : ''}`)
  }

  /**
   * Get user stats
   */
  async getUserStats(userId: string): Promise<ApiResponse<any>> {
    return this.callApi('/stats', {
      method: 'GET',
      params: { userId },
    })
  }

  /**
   * Submit user activity
   */
  async submitActivity(activity: {
    userId: string
    category: string
    type: string
    value?: number
    amount?: number
    date?: string
  }): Promise<ApiResponse<any>> {
    return this.callApi('/activities', {
      method: 'POST',
      body: activity,
    })
  }
}
