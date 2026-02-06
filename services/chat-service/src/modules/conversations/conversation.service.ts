import { ConversationModel } from '../../models/conversation.model';

export class ConversationService {
  static async listConversations(userId: string, includeArchived: boolean = false) {
    const query: any = { participants: userId };
    
    if (!includeArchived) {
      query['participantSettings'] = {
        $not: {
          $elemMatch: { userId, isArchived: true }
        }
      };
    }

    return ConversationModel.find(query).sort({ lastMessageAt: -1 });
  }

  static async updateParticipantSettings(conversationId: string, userId: string, settings: { isMuted?: boolean; isArchived?: boolean }) {
    const conversation = await ConversationModel.findById(conversationId);
    if (!conversation) throw new Error('Conversation not found');
    if (!conversation.participants.includes(userId)) throw new Error('Unauthorized');

    let userSettings = conversation.participantSettings.find(s => s.userId === userId);
    if (!userSettings) {
      userSettings = { userId, isMuted: false, isArchived: false };
      conversation.participantSettings.push(userSettings);
    }

    if (settings.isMuted !== undefined) userSettings.isMuted = settings.isMuted;
    if (settings.isArchived !== undefined) userSettings.isArchived = settings.isArchived;

    await conversation.save();
    return conversation;
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
