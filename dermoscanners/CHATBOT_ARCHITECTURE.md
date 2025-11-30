# Chatbot Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    Chat Button (Fixed)                     │ │
│  │  • Blue gradient with pulse animation                      │ │
│  │  • Green online indicator                                  │ │
│  │  • Bottom-right corner positioning                         │ │
│  └───────────────────────────────────────────────────────────┘ │
│                              ↓                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    Chat Window (Modal)                     │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  Header (Gradient)                                    │ │ │
│  │  │  • Sparkle icon + status                             │ │ │
│  │  │  • "Skincare Assistant"                              │ │ │
│  │  │  • Close button                                      │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  Messages Area (Scrollable)                          │ │ │
│  │  │                                                       │ │ │
│  │  │  ┌────────────────────────────────────────────────┐  │ │ │
│  │  │  │  Assistant Message (Left)                      │  │ │ │
│  │  │  │  • White background                            │  │ │ │
│  │  │  │  • Border styling                              │  │ │ │
│  │  │  │  • Timestamp below                             │  │ │ │
│  │  │  └────────────────────────────────────────────────┘  │ │ │
│  │  │                                                       │ │ │
│  │  │  ┌────────────────────────────────────────────────┐  │ │ │
│  │  │  │  Quick Reply Suggestions                       │  │ │ │
│  │  │  │  • Lightning icon header                       │  │ │ │
│  │  │  │  • 4-6 suggestion buttons                      │  │ │ │
│  │  │  │  • Sparkle icons                               │  │ │ │
│  │  │  │  • Hover effects                               │  │ │ │
│  │  │  └────────────────────────────────────────────────┘  │ │ │
│  │  │                                                       │ │ │
│  │  │          ┌────────────────────────────────────┐      │ │ │
│  │  │          │  User Message (Right)              │      │ │ │
│  │  │          │  • Blue gradient background        │      │ │ │
│  │  │          │  • White text                      │      │ │ │
│  │  │          │  • Timestamp below                 │      │ │ │
│  │  │          └────────────────────────────────────┘      │ │ │
│  │  │                                                       │ │ │
│  │  │  ┌────────────────────────────────────────────────┐  │ │ │
│  │  │  │  Typing Indicator                              │  │ │ │
│  │  │  │  • Three bouncing dots                         │  │ │ │
│  │  │  │  • Staggered animation                         │  │ │ │
│  │  │  └────────────────────────────────────────────────┘  │ │ │
│  │  │                                                       │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  Input Area                                          │ │ │
│  │  │  • Text input field                                  │ │ │
│  │  │  • Send button (gradient)                            │ │ │
│  │  │  • Disabled states during loading                    │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                            │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
ChatWidget (Root Component)
│
├── Chat Button (Closed State)
│   ├── MessageCircle Icon
│   └── Pulse Indicator
│
└── Chat Window (Open State)
    │
    ├── Header
    │   ├── Sparkles Icon + Status
    │   ├── Title + Subtitle
    │   └── Close Button
    │
    ├── Messages Container
    │   ├── Welcome Message
    │   ├── Quick Reply Suggestions
    │   │   ├── Header (Lightning Icon)
    │   │   └── Suggestion Buttons (4-6)
    │   ├── User Messages
    │   ├── Assistant Messages
    │   ├── Typing Indicator
    │   └── Auto-scroll Reference
    │
    └── Input Area
        ├── Text Input Field
        └── Send Button
```

## Data Flow

```
┌──────────────┐
│     USER     │
└──────┬───────┘
       │
       │ 1. Opens Chat
       ↓
┌──────────────────────┐
│   ChatWidget.tsx     │
│   (React Component)  │
└──────┬───────────────┘
       │
       │ 2. Load Suggestions
       ↓
┌──────────────────────────────────────────────────────────┐
│                    API REQUEST                           │
│  GET /api/chat/suggestions                               │
│  Headers: { Authorization: Bearer <token> }              │
└──────┬───────────────────────────────────────────────────┘
       │
       │ 3. Process Request
       ↓
┌──────────────────────┐
│  chatRoutes.js       │
│  (Express Router)    │
└──────┬───────────────┘
       │
       │ 4. Handle Request
       ↓
┌──────────────────────┐
│ chatController.js    │
│ (Business Logic)     │
└──────┬───────────────┘
       │
       │ 5. Return Suggestions
       ↓
┌──────────────────────────────────────────────────────────┐
│                    API RESPONSE                          │
│  { suggestions: [...] }                                  │
└──────┬───────────────────────────────────────────────────┘
       │
       │ 6. Display Suggestions
       ↓
┌──────────────────────┐
│   ChatWidget.tsx     │
│   (Update State)     │
└──────┬───────────────┘
       │
       │ 7. User Sends Message
       ↓
┌──────────────────────────────────────────────────────────┐
│                    API REQUEST                           │
│  POST /api/chat/message                                  │
│  Body: { message, conversationHistory }                  │
│  Headers: { Authorization: Bearer <token> }              │
└──────┬───────────────────────────────────────────────────┘
       │
       │ 8. Process Message
       ↓
┌──────────────────────┐
│ chatController.js    │
│ (Business Logic)     │
└──────┬───────────────┘
       │
       │ 9. Call AI Service
       ↓
┌──────────────────────────────────────────────────────────┐
│              GOOGLE GEMINI API                           │
│  POST /v1beta/models/gemini-2.5-flash:generateContent    │
│  Body: { contents, generationConfig }                    │
└──────┬───────────────────────────────────────────────────┘
       │
       │ 10. AI Response
       ↓
┌──────────────────────┐
│ chatController.js    │
│ (Process Response)   │
└──────┬───────────────┘
       │
       │ 11. Return to Client
       ↓
┌──────────────────────────────────────────────────────────┐
│                    API RESPONSE                          │
│  { response, timestamp }                                 │
└──────┬───────────────────────────────────────────────────┘
       │
       │ 12. Display Response
       ↓
┌──────────────────────┐
│   ChatWidget.tsx     │
│   (Update Messages)  │
└──────┬───────────────┘
       │
       │ 13. View Response
       ↓
┌──────────────┐
│     USER     │
└──────────────┘
```

## State Management

```
ChatWidget State
│
├── isOpen: boolean
│   └── Controls chat window visibility
│
├── messages: Message[]
│   ├── role: 'user' | 'assistant'
│   ├── content: string
│   └── timestamp: string
│
├── inputMessage: string
│   └── Current input field value
│
├── isLoading: boolean
│   └── API call in progress
│
├── isTyping: boolean
│   └── Typing indicator visibility
│
├── suggestions: string[]
│   └── Quick reply options
│
└── showSuggestions: boolean
    └── Suggestion visibility control
```

## Animation Timeline

```
Chat Opening Sequence:
0ms    → User clicks button
0ms    → isOpen = true
0ms    → Window starts slide-up animation
300ms  → Window fully visible
300ms  → Load suggestions API call
500ms  → Welcome message appears
800ms  → Suggestions appear
800ms  → Input field auto-focuses

Message Send Sequence:
0ms    → User clicks send
0ms    → User message appears
0ms    → Input clears
0ms    → isLoading = true
0ms    → isTyping = true
0ms    → Suggestions hide
100ms  → API request sent
1000ms → AI processing
1500ms → Response received
2000ms → Typing indicator hides
2000ms → Assistant message appears
2300ms → isLoading = false
2300ms → isTyping = false
```

## File Structure

```
dermoscanners/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── chat/
│   │   │       ├── ChatWidget.tsx          (Main component)
│   │   │       └── ChatWidget.test.tsx     (Unit tests)
│   │   │
│   │   ├── pages/
│   │   │   └── ChatDemoPage.tsx            (Demo page)
│   │   │
│   │   └── App.tsx                         (Router config)
│   │
│   └── CHAT_VISUAL_TEST.html               (Visual tests)
│
├── server/
│   ├── controllers/
│   │   └── chatController.js               (Business logic)
│   │
│   └── routes/
│       └── chatRoutes.js                   (API routes)
│
└── Documentation/
    ├── CHATBOT_FEATURE.md                  (Full docs)
    ├── CHATBOT_TESTING_GUIDE.md            (Testing)
    ├── CHATBOT_IMPLEMENTATION_SUMMARY.md   (Summary)
    ├── CHATBOT_QUICK_REFERENCE.md          (Quick ref)
    └── CHATBOT_ARCHITECTURE.md             (This file)
```

## Technology Stack

```
Frontend:
├── React 18
├── TypeScript
├── Tailwind CSS
├── Axios (HTTP client)
├── Lucide React (Icons)
└── Vite (Build tool)

Backend:
├── Node.js
├── Express.js
├── JWT Authentication
└── Google Gemini AI

Testing:
├── Vitest
├── React Testing Library
└── Manual testing suite
```

## Security Flow

```
┌──────────────┐
│     USER     │
└──────┬───────┘
       │
       │ 1. Login
       ↓
┌──────────────────────┐
│  Authentication      │
│  (JWT Token)         │
└──────┬───────────────┘
       │
       │ 2. Store Token
       ↓
┌──────────────────────┐
│  localStorage        │
│  { tokens: {...} }   │
└──────┬───────────────┘
       │
       │ 3. Chat Request
       ↓
┌──────────────────────────────────────┐
│  API Request                         │
│  Headers: {                          │
│    Authorization: Bearer <token>     │
│  }                                   │
└──────┬───────────────────────────────┘
       │
       │ 4. Verify Token
       ↓
┌──────────────────────┐
│  requireAuth         │
│  (Middleware)        │
└──────┬───────────────┘
       │
       ├─── Valid ────→ Continue
       │
       └─── Invalid ──→ 401 Unauthorized
```

## Performance Optimization

```
Optimization Strategies:
│
├── Component Level
│   ├── Proper state management
│   ├── Efficient re-renders
│   ├── Memoization where needed
│   └── Lazy loading
│
├── Animation Level
│   ├── CSS animations (GPU accelerated)
│   ├── Transform instead of position
│   ├── Will-change hints
│   └── RequestAnimationFrame
│
├── Network Level
│   ├── Debounced API calls
│   ├── Request cancellation
│   ├── Error retry logic
│   └── Timeout handling
│
└── Memory Level
    ├── Cleanup on unmount
    ├── Event listener removal
    ├── Ref cleanup
    └── State reset
```

## Responsive Design Strategy

```
Breakpoint Strategy:
│
├── Mobile First Approach
│   └── Base styles for mobile
│
├── Tablet (768px+)
│   ├── Adjust width
│   ├── Optimize spacing
│   └── Touch targets
│
└── Desktop (1024px+)
    ├── Full features
    ├── Hover states
    └── Keyboard shortcuts

Layout Adaptation:
│
├── Container
│   ├── Mobile: max-w-[calc(100vw-3rem)]
│   ├── Tablet: max-w-[calc(100vw-3rem)]
│   └── Desktop: w-96 (384px)
│
├── Height
│   ├── Mobile: max-h-[calc(100vh-3rem)]
│   ├── Tablet: max-h-[calc(100vh-3rem)]
│   └── Desktop: h-[600px]
│
└── Position
    └── All: fixed bottom-6 right-6
```

## Error Handling Flow

```
Error Scenarios:
│
├── Network Error
│   ├── Catch in try-catch
│   ├── Display user-friendly message
│   ├── Keep chat functional
│   └── Allow retry
│
├── Authentication Error (401)
│   ├── Detect status code
│   ├── Show session expired message
│   ├── Suggest re-login
│   └── Maintain chat state
│
├── API Error (500)
│   ├── Catch server error
│   ├── Display generic message
│   ├── Log to console
│   └── Allow retry
│
└── Validation Error
    ├── Prevent empty messages
    ├── Disable send button
    ├── Visual feedback
    └── No API call
```

---

**Architecture Version**: 1.0.0
**Last Updated**: November 30, 2025
**Status**: Production Ready ✅
