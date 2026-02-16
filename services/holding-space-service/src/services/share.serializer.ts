import { IShare } from '../models/Share';
import { ShareDTO, PublicShareDTO } from '@hold-yourself/types';

/**
 * Strict serializer for Share documents.
 * Prevents internal fields and accidental metric leakage.
 */
export const serializeShare = (share: IShare): ShareDTO => {
  return {
    id: share._id.toString(),
    authorId: share.anonymous ? 'anonymous' : share.authorId,
    content: share.content,
    visibility: share.visibility,
    anonymous: share.anonymous,
    commentsEnabled: share.commentsEnabled,
    sensitivityTags: share.sensitivityTags,
    createdAt: share.createdAt.toISOString(),
    updatedAt: share.updatedAt.toISOString(),
  };
};

export const serializeShares = (shares: IShare[]): ShareDTO[] => {
  return shares.map(serializeShare);
};

/**
 * Strict public serializer for Share documents.
 * Returns only content, tags and time. Strictly no authorId.
 */
export const serializePublicShare = (share: IShare): PublicShareDTO => {
  return {
    id: share._id.toString(),
    content: share.content,
    sensitivityTags: share.sensitivityTags,
    createdAt: share.createdAt.toISOString(),
  };
};
