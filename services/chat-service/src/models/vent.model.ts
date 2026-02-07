import mongoose, { Schema, Document } from 'mongoose';

export interface IVent extends Document {
  author: {
    id: string;
    anonymousName: string;
    anonymousColor: string;
  };
  circle: string;
  content: string;
  mood?: string;
  expiresAt: Date;
  reactions: Array<{
    userId: string;
    type: 'SUPPORT' | 'HUG' | 'SAME' | 'LISTEN' | 'hug' | 'listen' | 'heart';
  }>;
  createdAt: Date;
}

const VentSchema: Schema = new Schema(
  {
    author: {
      id: { type: String, required: true },
      anonymousName: { type: String, required: true },
      anonymousColor: { type: String, required: true },
    },
    circle: { type: Schema.Types.ObjectId, ref: 'Circle', required: true },
    content: { type: String, required: true, maxlength: 500 },
    mood: { type: String },
    expiresAt: { type: Date, required: true },
    reactions: [
      {
        userId: { type: String, required: true },
        type: { type: String, enum: ['SUPPORT', 'HUG', 'SAME', 'LISTEN', 'hug', 'listen', 'heart'], required: true },
      },
    ],
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Vents are immutable
    toJSON: {
      transform: (_doc, ret: any) => {
        ret.id = ret._id;
        if (ret.reactions && Array.isArray(ret.reactions)) {
          ret.reactions.forEach((r: any) => {
            if (r.userId) delete r.userId;
            if (r._id) delete r._id; // Also strip internal subdocument IDs
          });
        }
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// TTL Index: Automatically delete documents when expiresAt is reached
VentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const VentModel = mongoose.model<IVent>('Vent', VentSchema);
