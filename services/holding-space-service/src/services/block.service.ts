import { BlockModel } from '../models/Block';

export const BlockService = {
  /**
   * Checks if there is a block relationship between two users (either way).
   */
  isBlockedMutual: async (userIdA: string, userIdB: string): Promise<boolean> => {
    if (!userIdA || !userIdB) return false;
    if (userIdA === userIdB) return false;

    const block = await BlockModel.findOne({
      $or: [
        { blockerId: userIdA, blockedUserId: userIdB },
        { blockerId: userIdB, blockedUserId: userIdA }
      ]
    });

    return !!block;
  },

  /**
   * Returns a list of user IDs that a specific user has blocked.
   */
  getBlockedIds: async (userId: string): Promise<string[]> => {
    const blocks = await BlockModel.find({ blockerId: userId });
    return blocks.map(b => b.blockedUserId);
  },

  /**
   * Returns a list of user IDs that have blocked a specific user.
   */
  getBlockersOfIds: async (userId: string): Promise<string[]> => {
    const blocks = await BlockModel.find({ blockedUserId: userId });
    return blocks.map(b => b.blockerId);
  }
};
