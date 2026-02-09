import { IShare } from '../models/Share';
import { ShareDTO } from '@hold-yourself/types';

/**
 * Strict serializer for Share documents.
 * Prevents internal fields and accidental metric leakage.
 */
export const serializeShare = (share: IShare): ShareDTO => {
  return {
    id: share._id.toString(),
    authorId: share.authorId,
    content: share.content,
    visibility: share.visibility,
    anonymous: share.anonymous,
    commentsEnabled: share.commentsEnabled,
    createdAt: share.createdAt.toISOString(),
    updatedAt: share.updatedAt.toISOString(),
  };
};

export const serializeShares = (shares: IShare[]): ShareDTO[] => {
  return shares.map(serializeShare);
};
