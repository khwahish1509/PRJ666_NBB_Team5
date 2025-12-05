/**
 * Chat Context Middleware
 * Issue #58: Enriches chat requests with domain-specific context
 */

import { buildChatContext, formatContextPrompt, isContextRelevant } from '../services/chatContextService.js';

/**
 * Middleware to enrich chat requests with context
 * Adds enrichedContext to req object for use in controller
 */
export async function enrichChatContext(req, res, next) {
  try {
    const { message } = req.body;
    const userId = req.user?.id || req.user?._id || null;

    // Build context
    const context = await buildChatContext(userId, message);
    
    // Check if context is relevant to query
    const shouldIncludeContext = isContextRelevant(context, message);
    
    // Attach to request
    req.chatContext = {
      raw: context,
      formatted: shouldIncludeContext ? formatContextPrompt(context) : '',
      hasContext: shouldIncludeContext
    };

    next();
  } catch (error) {
    console.error('Error in chat context middleware:', error);
    // Continue without context on error
    req.chatContext = {
      raw: {},
      formatted: '',
      hasContext: false
    };
    next();
  }
}

export default enrichChatContext;
