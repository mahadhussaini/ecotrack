'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface AiAssistantProps {
  className?: string
  context?: 'general' | 'recommendations' | 'motivation'
  placeholder?: string
}

export default function AiAssistant({
  className,
  context = 'general',
  placeholder = "Ask me anything about sustainability..."
}: AiAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      content: "Hi! I'm your EcoTrack AI assistant. I can help you with sustainability tips, track your progress, and provide personalized recommendations. What would you like to know?",
      role: 'assistant',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          context,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          role: 'assistant',
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Sorry, I'm having trouble responding right now. Please try again later.",
          role: 'assistant',
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Network error. Please check your connection and try again.",
        role: 'assistant',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const quickQuestions = [
    "How can I reduce my carbon footprint?",
    "What activities give the most eco-points?",
    "Give me personalized recommendations",
    "How am I doing this week?",
  ]

  return (
    <>
      {/* Floating Action Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50",
          "bg-gradient-to-r from-eco-500 to-eco-600 hover:from-eco-600 hover:to-eco-700",
          "animate-bounce hover:animate-none"
        )}
        size="icon"
      >
        <Sparkles className="h-6 w-6 text-white" />
      </Button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg h-[600px] flex flex-col animate-in slide-in-from-bottom-4 duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bot className="h-5 w-5 text-eco-600" />
                EcoTrack AI Assistant
                <Badge variant="eco" className="text-xs">
                  {context}
                </Badge>
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0 w-8 h-8 bg-eco-100 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-eco-600" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[75%] rounded-lg px-3 py-2 text-sm",
                        message.role === 'user'
                          ? "bg-eco-600 text-white ml-auto"
                          : "bg-gray-100 text-gray-900"
                      )}
                    >
                      {message.content}
                    </div>
                    {message.role === 'user' && (
                      <div className="flex-shrink-0 w-8 h-8 bg-eco-600 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-eco-100 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-eco-600" />
                    </div>
                    <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-eco-600 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-eco-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-eco-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions */}
              {messages.length === 1 && (
                <div className="px-4 pb-2">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-muted-foreground mr-2">Try:</span>
                    {quickQuestions.slice(0, 2).map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => setInputValue(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Form */}
              <div className="border-t p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={placeholder}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-eco-600 hover:bg-eco-700"
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
