/**
 * Stub for follower relationships.
 * In a production environment, this would call the user-service or auth-service.
 */
export const FollowService = {
  /**
   * Checks if a viewer follows an author.
   * Mock implementation: always returns true for now (TODO: integrate with user-service).
   */
  isFollower: async (viewerId: string, authorId: string): Promise<boolean> => {
    // Guest followership is always false
    if (!viewerId) return false;

    // TODO: Implement actual lookup via internal-clients or direct service call
    console.log(`[FollowService] Mock check: Does ${viewerId} follow ${authorId}?`);
    
    // For simulation: assume 'viewer-non-follower' doesn't follow anyone else
    if (viewerId === 'viewer-non-follower') return false;

    return true;
  }
};
