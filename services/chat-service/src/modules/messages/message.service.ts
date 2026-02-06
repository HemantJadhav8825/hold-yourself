import { MessageModel } from '../../models/message.model';
import { ConversationModel } from '../../models/conversation.model';
import { socketService } from '../../socket';

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
      throw new Error('Message content cannot be empty.');
    }

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
      content: content.trim(),
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
