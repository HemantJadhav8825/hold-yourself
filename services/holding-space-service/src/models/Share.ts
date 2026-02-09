import mongoose, { Schema, Document } from 'mongoose';

export interface IShare extends Document {
  authorId: string;
  content: string;
  visibility: 'public';
  anonymous: boolean;
  commentsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  isShadowLimited: boolean;
}

const ShareSchema = new Schema<IShare>(
  {
    authorId: { type: String, required: true, index: true },
    content: { type: String, required: true, trim: true, minlength: 1, maxlength: 2000 },
    visibility: { type: String, enum: ['public'], default: 'public' },
    anonymous: { type: Boolean, default: false },
    commentsEnabled: { type: Boolean, default: true },
    isShadowLimited: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Emotional safety: No metrics allowed.
// STRICTLY NO: likeCount, commentCount, viewCount, engagementScore.

export const ShareModel = mongoose.model<IShare>('Share', ShareSchema);
