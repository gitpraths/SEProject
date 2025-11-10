'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  MessageCircle, 
  X, 
  Send, 
  Mic, 
  MicOff,
  Paperclip,
  Globe,
  User as UserIcon,
  Minimize2,
  Maximize2,
  MoreVertical
} from 'lucide-react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import toast from 'react-hot-toast'

interface Message {
  id: string
  type: 'user' | 'bot' | 'system'
  content: string
  timestamp: Date
  confidence?: number
  quickReplies?: string[]
  attachments?: File[]
}

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
]

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()
  const pathname = usePathname()

  // Get context-aware quick replies based on current page
  const getQuickReplies = () => {
    const pageQuickReplies: Record<string, string[]> = {
      '/dashboard': [
        'Show me today\'s tasks',
        'What shelters have beds?',
        'How do I add a new person?',
      ],
      '/dashboard/add-individual': [
        'Help with registration',
        'What info do I need?',
        'How to capture location?',
      ],
      '/dashboard/map': [
        'Find nearest shelter',
        'Show available resources',
        'Plan my route',
      ],
    }

    return pageQuickReplies[pathname] || [
      'How can I help someone?',
      'Show available shelters',
      'What are my tasks?',
    ]
  }

  const [quickReplies, setQuickReplies] = useState<string[]>(getQuickReplies())

  useEffect(() => {
    setQuickReplies(getQuickReplies())
  }, [pathname])

  useEffect(() => {
    // Initialize WebSocket connection
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000'
    const newSocket = io(`${WS_URL}/chat`)

    newSocket.on('connect', () => {
      console.log('Connected to chat server')
      if (user) {
        newSocket.emit('join', { user_id: user.id })
      }
    })

    newSocket.on('response', (data: any) => {
      setIsTyping(false)
      addMessage('bot', data.response, data.confidence, data.quick_replies)
      
      if (!isOpen) {
        setUnreadCount(prev => prev + 1)
      }
    })

    newSocket.on('escalation_needed', (data: any) => {
      addMessage('system', 'Connecting you with a staff member...', 1.0)
    })

    setSocket(newSocket)

    // Load chat history from localStorage
    loadChatHistory()

    // Add welcome message
    if (messages.length === 0) {
      addMessage('bot', "Hello! I'm your Homeless Aid assistant. How can I help you today?", 1.0, getQuickReplies())
    }

    return () => {
      newSocket.close()
    }
  }, [user])

  useEffect(() => {
    scrollToBottom()
    if (isOpen) {
      setUnreadCount(0)
    }
  }, [messages, isOpen])

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chat_history', JSON.stringify(messages))
    }
  }, [messages])

  const loadChatHistory = () => {
    const history = localStorage.getItem('chat_history')
    if (history) {
      try {
        const parsed = JSON.parse(history)
        setMessages(parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        })))
      } catch (error) {
        console.error('Failed to load chat history:', error)
      }
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const addMessage = (
    type: 'user' | 'bot' | 'system',
    content: string,
    confidence?: number,
    quickReplies?: string[]
  ) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      confidence,
      quickReplies,
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const handleSend = () => {
    if (!input.trim() || !socket || !user) return

    addMessage('user', input)
    setIsTyping(true)

    socket.emit('message', {
      user_id: user.id,
      message: input,
      user_role: user.role,
      language: selectedLanguage,
      context: {
        current_page: pathname,
      },
    })

    setInput('')
    setAttachments([])
  }

  const handleQuickReply = (reply: string) => {
    setInput(reply)
    setTimeout(() => handleSend(), 100)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleVoiceInput = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Speech recognition not supported')
      return
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.lang = selectedLanguage === 'en' ? 'en-US' : 
                       selectedLanguage === 'hi' ? 'hi-IN' :
                       selectedLanguage === 'ta' ? 'ta-IN' : 'te-IN'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setIsRecording(true)
      toast.success('Listening...')
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      setIsRecording(false)
    }

    recognition.onerror = () => {
      setIsRecording(false)
      toast.error('Speech recognition failed')
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognition.start()
  }

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setAttachments(prev => [...prev, ...files])
      toast.success(`${files.length} file(s) attached`)
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleEscalate = () => {
    if (socket && user) {
      socket.emit('escalate', { user_id: user.id })
      addMessage('system', 'Connecting you with a staff member. Please wait...')
    }
  }

  const clearHistory = () => {
    setMessages([])
    localStorage.removeItem('chat_history')
    addMessage('bot', "Chat history cleared. How can I help you?", 1.0, getQuickReplies())
    setShowMenu(false)
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all hover:scale-110 z-50 group"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6 mx-auto" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl flex flex-col z-50 animate-fadeIn transition-all ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[600px] md:h-[700px]'
        }`}>
          {/* Header */}
          <div className="bg-primary-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-xs text-primary-100">
                  {isTyping ? 'Typing...' : 'Online'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/20 rounded"
                title={isMinimized ? 'Maximize' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 hover:bg-white/20 rounded"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                    <button
                      onClick={handleEscalate}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <UserIcon className="w-4 h-4 inline mr-2" />
                      Talk to Human
                    </button>
                    <button
                      onClick={clearHistory}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Clear History
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id}>
                    <div
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-primary-600 text-white'
                            : message.type === 'system'
                            ? 'bg-yellow-50 text-yellow-900 border border-yellow-200'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className={`text-xs ${
                            message.type === 'user' ? 'text-primary-100' : 
                            message.type === 'system' ? 'text-yellow-700' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          {message.confidence !== undefined && message.confidence < 0.7 && (
                            <span className="text-xs text-orange-600 ml-2">
                              Low confidence
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Replies */}
                    {message.quickReplies && message.quickReplies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2 ml-2">
                        {message.quickReplies.map((reply, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuickReply(reply)}
                            className="px-3 py-1 bg-white border border-primary-300 text-primary-600 rounded-full text-xs font-medium hover:bg-primary-50 transition-colors"
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Attachments Preview */}
              {attachments.length > 0 && (
                <div className="px-4 py-2 border-t bg-gray-50">
                  <div className="flex flex-wrap gap-2">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-1 bg-white border rounded-lg text-xs"
                      >
                        <Paperclip className="w-3 h-3" />
                        <span className="max-w-[100px] truncate">{file.name}</span>
                        <button
                          onClick={() => removeAttachment(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t">
                {/* Language Selector */}
                <div className="flex items-center justify-between mb-2">
                  <div className="relative">
                    <button
                      onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                      className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900"
                    >
                      <Globe className="w-3 h-3" />
                      <span>{languages.find(l => l.code === selectedLanguage)?.flag}</span>
                      <span>{languages.find(l => l.code === selectedLanguage)?.name}</span>
                    </button>
                    {showLanguageMenu && (
                      <div className="absolute bottom-full left-0 mb-2 w-40 bg-white rounded-lg shadow-lg py-2 z-10">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setSelectedLanguage(lang.code)
                              setShowLanguageMenu(false)
                              toast.success(`Language changed to ${lang.name}`)
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                          >
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleEscalate}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Talk to Human
                  </button>
                </div>

                {/* Input Row */}
                <div className="flex gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Attach file"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileAttach}
                    className="hidden"
                    multiple
                  />
                  
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  />
                  
                  <button
                    onClick={handleVoiceInput}
                    className={`p-2 rounded-lg transition-colors ${
                      isRecording
                        ? 'bg-red-100 text-red-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    title="Voice input"
                  >
                    {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  
                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="btn btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>

                {/* Quick Replies */}
                {quickReplies.length > 0 && messages.length <= 1 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {quickReplies.map((reply, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickReply(reply)}
                        className="px-3 py-1 bg-primary-50 border border-primary-200 text-primary-700 rounded-full text-xs font-medium hover:bg-primary-100 transition-colors"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}

