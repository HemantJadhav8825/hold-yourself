import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  shareId: mongoose.Types.ObjectId;
  authorId: string;
  content: string;
  createdAt: Date;
  isShadowLimited: boolean;
}

const CommentSchema = new Schema<IComment>(
  {
    shareId: { type: Schema.Types.ObjectId, ref: 'Share', required: true },
    authorId: { type: String, required: true },
    content: { type: String, required: true, trim: true, minlength: 1, maxlength: 1000 },
    isShadowLimited: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Flat structure: No nesting, no replies to replies.
// Emotional safety: No counts, no ranking.

export const CommentModel = mongoose.model<IComment>('Comment', CommentSchema);
