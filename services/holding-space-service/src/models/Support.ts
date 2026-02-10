import mongoose, { Schema, Document } from 'mongoose';

export interface ISupport extends Document {
  shareId: mongoose.Types.ObjectId;
  userId: string;
  type: 'WITH_YOU' | 'HOLDING' | 'HEARD' | 'SUPPORT';
  createdAt: Date;
}

const SupportSchema = new Schema<ISupport>(
  {
    shareId: { type: Schema.Types.ObjectId, ref: 'Share', required: true },
    userId: { type: String, required: true },
    type: {
      type: String,
      enum: ['WITH_YOU', 'HOLDING', 'HEARD', 'SUPPORT'],
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// One support per user per share.
SupportSchema.index({ userId: 1, shareId: 1 }, { unique: true });

// Emotional safety: No metrics allowed.
// STRICTLY NO: likeCount, viewCount, etc.

export const SupportModel = mongoose.model<ISupport>('Support', SupportSchema);
