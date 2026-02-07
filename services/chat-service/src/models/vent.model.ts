import mongoose, { Schema, Document } from 'mongoose';

export interface IVent extends Document {
  author: string; // User ID
  circle: string; // Circle ID
  content: string;
  mood?: string;
  expiresAt: Date;
  reactions: Array<{
    userId: string;
    type: 'hug' | 'listen' | 'heart';
  }>;
  createdAt: Date;
}

const VentSchema: Schema = new Schema(
  {
    author: { type: String, required: true }, // We will mask this in API responses
    circle: { type: Schema.Types.ObjectId, ref: 'Circle', required: true },
    content: { type: String, required: true, maxlength: 500 },
    mood: { type: String },
    expiresAt: { type: Date, required: true },
    reactions: [
      {
        userId: { type: String, required: true },
        type: { type: String, enum: ['hug', 'listen', 'heart'], required: true },
      },
    ],
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Vents are immutable
    toJSON: {
      transform: (_doc, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// TTL Index: Automatically delete documents when expiresAt is reached
VentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// Index for fetching vents by circle
VentSchema.index({ circle: 1, createdAt: -1 });

export const VentModel = mongoose.model<IVent>('Vent', VentSchema);
