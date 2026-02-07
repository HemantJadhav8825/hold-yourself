import mongoose, { Schema, Document } from 'mongoose';

export interface IVent extends Document {
  author: {
    id: string;
    anonymousName: string;
    anonymousColor: string;
  };
  content: string;
  expiresAt: Date;
  reactions: Array<{
    userId: string;
    type: 'SUPPORT' | 'HUG' | 'SAME' | 'LISTEN';
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
    content: { type: String, required: true, maxlength: 280 },
    expiresAt: { type: Date, required: true },
    reactions: [
      {
        userId: { type: String, required: true },
        type: { type: String, enum: ['SUPPORT', 'HUG', 'SAME', 'LISTEN'], required: true },
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

export const VentModel = mongoose.model<IVent>('Vent', VentSchema);
