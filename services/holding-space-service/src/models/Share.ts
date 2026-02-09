export interface Share {
  id: string;
  authorId: string;
  content: string;
  visibility: 'public' | 'private' | 'ghost';
  anonymous: boolean;
  commentsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  isShadowLimited: boolean;

  /**
   * NO metrics or engagement scores allowed for emotional safety.
   * NO: likeCount, commentCount, viewCount, engagementScore.
   */
}
