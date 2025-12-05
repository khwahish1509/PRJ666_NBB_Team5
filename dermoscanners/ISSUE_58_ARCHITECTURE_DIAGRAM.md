# Issue #58: Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│                                                                  │
│  ┌──────────────┐                                               │
│  │ ChatWidget   │  User asks: "Is this product safe?"           │
│  └──────┬───────┘                                               │
│         │                                                        │
└─────────┼────────────────────────────────────────────────────────┘
          │ POST /api/chat/message
          │ { message, conversationHistory }
          │ Authorization: Bearer TOKEN
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ MIDDLEWARE CHAIN                                          │  │
│  │                                                            │  │
│  │  1. requireAuth                                           │  │
│  │     ├─ Verify JWT token                                   │  │
│  │     ├─ Extract user ID                                    │  │
│  │     └─ Attach to req.user                                 │  │
│  │                                                            │  │
│  │  2. enrichChatContext ⭐ NEW                              │  │
│  │     ├─ Call buildChatContext(userId, message)            │  │
│  │     ├─ Check isContextRelevant()                          │  │
│  │     └─ Attach to req.chatContext                          │  │
│  │                                                            │  │
│  │  3. sendMessage (Controller)                              │  │
│  │     ├─ Build AI prompt with context                       │  │
│  │     ├─ Call Gemini API                                    │  │
│  │     └─ Return response                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Context Building Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  enrichChatContext Middleware                                    │
│                                                                  │
│  Input: userId, message                                         │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ buildChatContext(userId, message)                       │    │
│  │                                                          │    │
│  │  ┌──────────────────────────────────────────────────┐  │    │
│  │  │ 1. Get User Profile                               │  │    │
│  │  │    Query: User.findById(userId)                   │  │    │
│  │  │    Returns: { name, skinType, skinGoals }         │  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  │                                                          │    │
│  │  ┌──────────────────────────────────────────────────┐  │    │
│  │  │ 2. Get Last Scanned Product                       │  │    │
│  │  │    Query: ScanHistory.findOne({ userId })         │  │    │
│  │  │           .sort({ scannedAt: -1 })                │  │    │
│  │  │           .populate('productId')                  │  │    │
│  │  │    Returns: Product with ingredients              │  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  │                                                          │    │
│  │  ┌──────────────────────────────────────────────────┐  │    │
│  │  │ 3. Extract Ingredient Mentions                    │  │    │
│  │  │    Scan message for common ingredients            │  │    │
│  │  │    e.g., "salicylic acid", "retinol"              │  │    │
│  │  │    Returns: Array of ingredient info              │  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  │                                                          │    │
│  │  ┌──────────────────────────────────────────────────┐  │    │
│  │  │ 4. Analyze Product Safety (if relevant)           │  │    │
│  │  │    Call: analyzeProductIngredients()              │  │    │
│  │  │    Returns: { safetyRating, riskLevel, warnings } │  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  │                                                          │    │
│  │  ┌──────────────────────────────────────────────────┐  │    │
│  │  │ 5. Get Recommendations                            │  │    │
│  │  │    Call: getRecommendations({ userId, skinType }) │  │    │
│  │  │    Returns: Top 3 recommended products            │  │    │
│  │  └──────────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ formatContextPrompt(context)                            │    │
│  │                                                          │    │
│  │  Formats into structured prompt:                       │    │
│  │  === USER PROFILE ===                                  │    │
│  │  === LAST SCANNED PRODUCT ===                          │    │
│  │  === PRODUCT SAFETY ANALYSIS ===                       │    │
│  │  === INGREDIENT INFORMATION ===                        │    │
│  │  === RECOMMENDED PRODUCTS ===                          │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Output: req.chatContext = {                                    │
│    raw: { userProfile, lastScannedProduct, ... },              │
│    formatted: "=== USER PROFILE === ...",                      │
│    hasContext: true                                             │
│  }                                                              │
└──────────────────────────────────────────────────────────────────┘
```

## AI Prompt Construction

```
┌─────────────────────────────────────────────────────────────────┐
│  sendMessage Controller                                          │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ Build Conversation Text                                 │    │
│  │                                                          │    │
│  │  1. BASE_SYSTEM_CONTEXT                                 │    │
│  │     "You are a helpful skincare assistant..."           │    │
│  │                                                          │    │
│  │  2. ENRICHED CONTEXT (if available) ⭐                  │    │
│  │     req.chatContext.formatted                           │    │
│  │     === USER PROFILE ===                                │    │
│  │     Name: John Doe                                      │    │
│  │     Skin Type: oily                                     │    │
│  │     Skin Goals: Reduce acne                             │    │
│  │                                                          │    │
│  │     === LAST SCANNED PRODUCT ===                        │    │
│  │     Product: CeraVe - Hydrating Cleanser                │    │
│  │     Safety Rating: safe                                 │    │
│  │     Key Ingredients: Hyaluronic Acid, Ceramides         │    │
│  │                                                          │    │
│  │  3. CONVERSATION HISTORY                                │    │
│  │     Last 5 messages                                     │    │
│  │                                                          │    │
│  │  4. CURRENT MESSAGE                                     │    │
│  │     User: "Is this product safe?"                       │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ Call Gemini API                                         │    │
│  │                                                          │    │
│  │  POST https://generativelanguage.googleapis.com/...    │    │
│  │  {                                                      │    │
│  │    contents: [{ parts: [{ text: conversationText }] }] │    │
│  │  }                                                      │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ AI Response (Context-Aware!)                            │    │
│  │                                                          │    │
│  │  "Based on your oily skin type and the CeraVe          │    │
│  │   Hydrating Cleanser you scanned, this product is      │    │
│  │   safe to use. It contains gentle ingredients like     │    │
│  │   Hyaluronic Acid and Ceramides which are suitable     │    │
│  │   for your skin. The safety rating is 'safe' with      │    │
│  │   no high-risk ingredients."                            │    │
│  └────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌──────────┐     ┌──────────┐     ┌──────────────┐     ┌──────────┐
│  User    │────▶│  Chat    │────▶│  Middleware  │────▶│   AI     │
│          │     │  Widget  │     │   Pipeline   │     │  Service │
└──────────┘     └──────────┘     └──────────────┘     └──────────┘
                                          │
                                          │ Enriches with:
                                          │
                      ┌───────────────────┼───────────────────┐
                      │                   │                   │
                      ▼                   ▼                   ▼
              ┌──────────────┐    ┌──────────────┐   ┌──────────────┐
              │   MongoDB    │    │  Ingredient  │   │ Recommendation│
              │              │    │   Safety     │   │    Engine     │
              │ - User       │    │   Service    │   │               │
              │ - Product    │    │              │   │               │
              │ - ScanHistory│    │              │   │               │
              └──────────────┘    └──────────────┘   └──────────────┘
```

## Context Relevance Decision Tree

```
                    User Message
                         │
                         ▼
              ┌──────────────────────┐
              │ Is it unrelated?     │
              │ (time, weather, etc) │
              └──────────┬───────────┘
                         │
                    ┌────┴────┐
                    │         │
                   Yes       No
                    │         │
                    ▼         ▼
              ┌─────────┐   ┌──────────────────────┐
              │ Return  │   │ Has user profile AND │
              │ false   │   │ skincare keywords?   │
              └─────────┘   └──────────┬───────────┘
                                       │
                                  ┌────┴────┐
                                  │         │
                                 Yes       No
                                  │         │
                                  ▼         ▼
                            ┌─────────┐   ┌──────────────────┐
                            │ Return  │   │ Has product      │
                            │ true    │   │ keywords?        │
                            └─────────┘   └──────┬───────────┘
                                                 │
                                            ┌────┴────┐
                                            │         │
                                           Yes       No
                                            │         │
                                            ▼         ▼
                                      ┌─────────┐   ┌──────────────┐
                                      │ Return  │   │ Has ingredient│
                                      │ true    │   │ mentions?    │
                                      └─────────┘   └──────┬───────┘
                                                           │
                                                      ┌────┴────┐
                                                      │         │
                                                     Yes       No
                                                      │         │
                                                      ▼         ▼
                                                ┌─────────┐   ┌─────────┐
                                                │ Return  │   │ Return  │
                                                │ true    │   │ false   │
                                                └─────────┘   └─────────┘
```

## Database Schema Relationships

```
┌─────────────────┐
│      User       │
│─────────────────│
│ _id             │◀────────┐
│ name            │         │
│ email           │         │
│ skinType        │         │ userId (ref)
│ skinGoals       │         │
└─────────────────┘         │
                            │
                   ┌────────┴────────┐
                   │  ScanHistory    │
                   │─────────────────│
                   │ _id             │
                   │ userId          │
                   │ productId       │──────┐
                   │ scannedAt       │      │
                   │ productSnapshot │      │ productId (ref)
                   └─────────────────┘      │
                                            │
                                            ▼
                                   ┌─────────────────┐
                                   │    Product      │
                                   │─────────────────│
                                   │ _id             │
                                   │ name            │
                                   │ brand           │
                                   │ ingredients[]   │
                                   │ safetyRating    │
                                   │ rating          │
                                   │ category        │
                                   │ skinTypes[]     │
                                   └─────────────────┘
```

## Key Components

### 1. chatContextService.js
```javascript
buildChatContext(userId, message)
  ├─ getUserProfile(userId)
  ├─ getLastScannedProduct(userId)
  ├─ extractIngredientMentions(message)
  ├─ analyzeProductIngredients(ingredients)
  └─ getRecommendations(options)

formatContextPrompt(context)
  └─ Returns formatted string

isContextRelevant(context, message)
  └─ Returns boolean
```

### 2. chatContextMiddleware.js
```javascript
enrichChatContext(req, res, next)
  ├─ Extract userId from req.user
  ├─ Call buildChatContext()
  ├─ Check isContextRelevant()
  ├─ Attach to req.chatContext
  └─ Call next()
```

### 3. chatController.js
```javascript
sendMessage(req, res)
  ├─ Build BASE_SYSTEM_CONTEXT
  ├─ Append req.chatContext.formatted
  ├─ Add conversation history
  ├─ Call Gemini API
  └─ Return response
```

## Performance Optimization

```
┌─────────────────────────────────────────────────────────────┐
│  Optimization Strategies                                     │
│                                                              │
│  1. Selective Loading                                       │
│     ├─ Only fetch data when relevant                        │
│     └─ Use isContextRelevant() to skip unnecessary work     │
│                                                              │
│  2. Lean Queries                                            │
│     ├─ Use .lean() for faster MongoDB queries               │
│     ├─ Select only required fields                          │
│     └─ Limit results (last 50 scans, top 3 recommendations) │
│                                                              │
│  3. Error Handling                                          │
│     ├─ Try-catch blocks                                     │
│     ├─ Graceful degradation                                 │
│     └─ Continue without context on errors                   │
│                                                              │
│  4. Caching (Future)                                        │
│     ├─ Cache user profile for 5 minutes                     │
│     └─ Cache last scanned product                           │
└─────────────────────────────────────────────────────────────┘
```

## Summary

This architecture enables the chatbot to provide **intelligent, personalized responses** by:

1. ✅ Enriching queries with user profile data
2. ✅ Including last scanned product information
3. ✅ Analyzing ingredient safety
4. ✅ Providing personalized recommendations
5. ✅ Maintaining performance with optimizations
6. ✅ Handling errors gracefully

The modular design ensures maintainability and allows for future enhancements!
