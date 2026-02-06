import { ConversationModel } from '../../models/conversation.model';

export class ConversationService {
  static async listConversations(userId: string) {
    return ConversationModel.find({
      participants: userId,
    }).sort({ lastMessageAt: -1 });
  }

  static async findOrCreateConversation(user1: string, user2: string) {
    if (user1 === user2) {
      throw new Error('Cannot create a conversation with yourself.');
    }

    const participants = [user1, user2].sort();
    
    // Attempt to find existing
    let conversation = await ConversationModel.findOne({
      participants: { $all: participants },
    });

    if (!conversation) {
      conversation = await ConversationModel.create({
        participants,
      });
    }

    return conversation;
  }

  static async findConversationById(conversationId: string) {
    return ConversationModel.findById(conversationId);
  }

  static async isParticipant(conversationId: string, userId: string) {
    const conversation = await ConversationModel.findById(conversationId);
    return conversation?.participants.includes(userId) || false;
  }
}
