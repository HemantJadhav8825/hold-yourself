import { MessageModel } from '../../models/message.model';
import { ConversationModel } from '../../models/conversation.model';
import { socketService } from '../../socket';
import { GuardrailService } from '../../security/guardrails';
import { structuredLog } from '@hold-yourself/utils';

export class MessageService {
  static async listMessages(conversationId: string, limit: number = 50, beforeEmail?: Date) {
    const query: any = { conversationId };
    
    // Pagination support
    if (beforeEmail) {
      query.createdAt = { $lt: beforeEmail };
    }

    return MessageModel.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  static async sendMessage(conversationId: string, senderId: string, content: string, clientMessageId?: string) {
    if (!content.trim()) {
      structuredLog('warn', 'message:send_failure', 'Empty message content', { userId: senderId, conversationId });
      throw new Error('Message content cannot be empty.');
    }

    // Guardrail: Length Check
    if (!GuardrailService.isLengthValid(content)) {
      structuredLog('warn', 'message:send_failure', 'Message exceeds max length', { 
        userId: senderId, 
        conversationId, 
        contentLength: content.length 
      });
      throw new Error(`Message is too long (max ${2000} characters).`);
    }

    // Guardrail: Rate Limiting
    if (!GuardrailService.checkRateLimit(senderId, conversationId)) {
      structuredLog('warn', 'message:send_failure', 'Rate limit exceeded', { userId: senderId, conversationId });
      throw new Error('Too many messages. Please slow down.');
    }

    // Guardrail: Sanitization
    const sanitizedContent = GuardrailService.sanitizeContent(content.trim());

    // Idempotency check
    if (clientMessageId) {
      const existingMessage = await MessageModel.findOne({ clientMessageId });
      if (existingMessage) {
        return existingMessage;
      }
    }

    // Create message
    const message = await MessageModel.create({
      conversationId,
      clientMessageId,
      senderId,
      content: sanitizedContent,
    });

    structuredLog('info', 'message:sent', 'Message sent successfully', {
      userId: senderId,
      conversationId,
      messageId: message._id.toString(),
      clientMessageId,
    });

    // Update conversation lastMessageAt
    const conversation = await ConversationModel.findByIdAndUpdate(conversationId, {
      lastMessageAt: message.createdAt,
    }, { new: true });

    // Emit real-time event to participants
    if (conversation && conversation.participants) {
      conversation.participants.forEach((participant: any) => {
        // Handle both populated and unpopulated/string IDs
        const participantId = participant.id || participant.toString(); // assuming Mongoose populated or string
        // Actually participants in ConversationModel are usually ObjectId refs.
        // If unpopulated, they are ObjectIds. toString() works.
        // If populated, they are objects with _id on them.
        
        socketService.emitToUser(participantId.toString(), 'message:new', {
          ...message.toObject(),
          id: message._id.toString() // Ensure ID is string for frontend
        });
      });
    }

    return message;
  }
}
