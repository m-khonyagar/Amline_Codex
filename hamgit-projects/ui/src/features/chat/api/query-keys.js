const generateConversationListQueryKey = (userId) => {
  return ['conversation-list', userId]
}

const generateConversationQueryKey = (conversationId) => {
  return ['conversation', conversationId]
}

const generateFindConversationQueryKey = (filters) => {
  return ['conversation-search', filters]
}

const generateConversationMessagesQueryKey = (conversationId) => {
  return ['messages', conversationId]
}

export {
  generateConversationListQueryKey,
  generateConversationQueryKey,
  generateFindConversationQueryKey,
  generateConversationMessagesQueryKey,
}
