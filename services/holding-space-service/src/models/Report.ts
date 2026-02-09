import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  reporterId: string;
  targetType: 'share' | 'comment';
  targetId: mongoose.Types.ObjectId;
  reason: string;
  status: 'pending' | 'reviewed' | 'actioned';
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

const ReportSchema = new Schema<IReport>(
  {
    reporterId: { type: String, required: true, index: true },
    targetType: { type: String, enum: ['share', 'comment'], required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    reason: { type: String, required: true, maxlength: 500 },
    status: { type: String, enum: ['pending', 'reviewed', 'actioned'], default: 'pending' },
    reviewedAt: { type: Date },
    reviewedBy: { type: String },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const ReportModel = mongoose.model<IReport>('Report', ReportSchema);
