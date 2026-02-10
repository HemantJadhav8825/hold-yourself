import { CommentModel } from '../models/Comment';

/**
 * Backend safety hook to prevent rapid commenting.
 * Limits users to 5 comments within a 60-second window.
 */
export const checkRapidCommenting = async (userId: string): Promise<void> => {
  const sixtySecondsAgo = new Date(Date.now() - 60000);
  
  const recentCommentCount = await CommentModel.countDocuments({
    authorId: userId,
    createdAt: { $gte: sixtySecondsAgo },
  });

  if (recentCommentCount >= 5) {
    const error: any = new Error('Take a breath before responding.');
    error.statusCode = 429;
    throw error;
  }
};
