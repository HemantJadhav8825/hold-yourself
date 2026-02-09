import mongoose, { Schema, Document } from 'mongoose';

export interface IBlock extends Document {
  blockerId: string;
  blockedUserId: string;
  createdAt: Date;
}

const BlockSchema = new Schema<IBlock>(
  {
    blockerId: { type: String, required: true },
    blockedUserId: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Unique compound index (blockerId + blockedUserId)
BlockSchema.index({ blockerId: 1, blockedUserId: 1 }, { unique: true });

export const BlockModel = mongoose.model<IBlock>('Block', BlockSchema);
