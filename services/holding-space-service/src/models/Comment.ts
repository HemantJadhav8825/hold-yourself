import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  shareId: mongoose.Types.ObjectId;
  authorId: string;
  content: string;
  anonymous: boolean;
  isShadowLimited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    shareId: { type: Schema.Types.ObjectId, ref: 'Share', required: true, index: true },
    authorId: { type: String, required: true, index: true },
    content: { type: String, required: true, trim: true, minlength: 1, maxlength: 500 },
    anonymous: { type: Boolean, default: false },
    isShadowLimited: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Safety: No metrics allowed.
// STRICTLY NO: likeCount.

export const CommentModel = mongoose.model<IComment>('Comment', CommentSchema);
