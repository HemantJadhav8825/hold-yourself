import { IShare } from '../models/Share';
import { FollowService } from '../services/follow.service';

/**
 * Visibility enforcement logic.
 */
export const canViewerSeeShare = async (viewerId: string, share: IShare): Promise<boolean> => {
  if (share.visibility === 'public') {
    return true;
  }

  if (share.visibility === 'followers') {
    // Author can always see their own share
    if (viewerId === share.authorId) {
      return true;
    }

    // Check follower relationship
    return await FollowService.isFollower(viewerId, share.authorId);
  }

  return false;
};
