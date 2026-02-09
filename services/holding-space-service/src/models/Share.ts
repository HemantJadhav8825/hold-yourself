import mongoose, { Schema, Document } from 'mongoose';

export interface IShare extends Document {
  authorId: string;
  content: string;
  visibility: 'public' | 'followers';
  anonymous: boolean;
  commentsEnabled: boolean;
  sensitivityTags: string[];
  createdAt: Date;
  updatedAt: Date;
  isShadowLimited: boolean;
}

const ShareSchema = new Schema<IShare>(
  {
    authorId: { type: String, required: true, index: true },
    content: { type: String, required: true, trim: true, minlength: 1, maxlength: 2000 },
    visibility: { type: String, enum: ['public', 'followers'], default: 'public' },
    anonymous: { type: Boolean, default: false },
    commentsEnabled: { type: Boolean, default: true },
    sensitivityTags: { type: [String], default: [] },
    isShadowLimited: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Emotional safety: No metrics allowed.
// STRICTLY NO: likeCount, commentCount, viewCount, engagementScore.

export const ShareModel = mongoose.model<IShare>('Share', ShareSchema);
