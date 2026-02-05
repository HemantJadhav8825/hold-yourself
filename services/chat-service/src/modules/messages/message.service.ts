import { MessageModel } from '../../models/message.model';
import { ConversationModel } from '../../models/conversation.model';

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

  static async sendMessage(conversationId: string, senderId: string, content: string) {
    if (!content.trim()) {
      throw new Error('Message content cannot be empty.');
    }

    // Create message
    const message = await MessageModel.create({
      conversationId,
      senderId,
      content: content.trim(),
    });

    // Update conversation lastMessageAt
    await ConversationModel.findByIdAndUpdate(conversationId, {
      lastMessageAt: message.createdAt,
    });

    return message;
  }
}
