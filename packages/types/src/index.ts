export interface ShareDTO {
  id: string;
  authorId: string;
  content: string;
  visibility: 'public';
  anonymous: boolean;
  commentsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShareInput {
  content: string;
}

export interface UpdateShareInput {
  content?: string;
  commentsEnabled?: boolean;
}
