# API Integration Layer

This directory contains the centralized server-side API integrations for EcoTrack.

## Structure

```
src/api/
├── base/           # Base API client with common functionality
├── external/       # External third-party API services
├── internal/       # Internal API client for our endpoints
├── types/          # Shared TypeScript types
└── README.md       # This file
```

## Usage

### External APIs

```typescript
import { createOpenAIService } from '@/api'

// Create OpenAI service with environment variables
const openai = createOpenAIService()

// Generate recommendations
const response = await openai.generateRecommendations(userActivities, userStats)
if (response.success) {
  console.log('Recommendations:', response.data)
}
```

### Internal APIs

```typescript
import { InternalApiClient } from '@/api'

const internalApi = new InternalApiClient()

// Call our own API endpoints
const activities = await internalApi.getActivities(userId)
const recommendations = await internalApi.getRecommendations()
```

### Custom API Client

```typescript
import { BaseApiClient } from '@/api'

class CustomService extends BaseApiClient {
  async getData() {
    return this.request('/api/data')
  }
}
```

## Features

- **Automatic Retries**: Configurable retry logic with exponential backoff
- **Error Handling**: Comprehensive error handling and normalization
- **Logging**: Built-in logging with configurable levels
- **Type Safety**: Full TypeScript support
- **Timeout Handling**: Configurable request timeouts
- **Request IDs**: Unique request IDs for tracking

## Configuration

### Environment Variables

```env
OPENAI_API_KEY=sk-your-api-key-here
```

### Custom Configuration

```typescript
const client = new BaseApiClient({
  baseURL: 'https://api.example.com',
  timeout: 30000,
  retries: 3,
  headers: {
    'Authorization': 'Bearer token'
  }
})
```

## Error Handling

All API calls return a standardized response:

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiError
  metadata?: {
    requestId: string
    timestamp: number
    duration: number
  }
}
```
