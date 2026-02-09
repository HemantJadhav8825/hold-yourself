import { IComment } from '../models/Comment';
import { CommentDTO } from '@hold-yourself/types';

/**
 * Strict serializer for Comment documents.
 * Prevents internal flags or raw DB fields exposure.
 */
export const serializeComment = (comment: IComment): CommentDTO => {
  return {
    id: comment._id.toString(),
    shareId: comment.shareId.toString(),
    authorId: comment.authorId,
    content: comment.content,
    createdAt: comment.createdAt.toISOString(),
  };
};

export const serializeComments = (comments: IComment[]): CommentDTO[] => {
  return comments.map(serializeComment);
};
