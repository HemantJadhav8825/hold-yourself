export interface ShareDTO {
  id: string;
  authorId: string; // Will be "anonymous" if anonymous is true
  content: string;
  visibility: 'public' | 'followers';
  anonymous: boolean;
  commentsEnabled: boolean;
  sensitivityTags: string[];
  createdAt: string;
  updatedAt: string;
  isOwner?: boolean;
}
