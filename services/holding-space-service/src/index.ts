import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || 3300;
const DATABASE_URL = process.env.DATABASE_URL;

const start = async () => {
  try {
    if(!DATABASE_URL){
      throw new Error('DATABASE_URL is not defined');
    }
    // 1. Connect to Database
    console.log('[holding-space-service] Connecting to database...');
    await mongoose.connect(DATABASE_URL);
    console.log('✅ MongoDB connected successfully');

    // 2. Start Server
    app.listen(PORT, () => {
      console.log(`[holding-space-service] started on port ${PORT}`);
      console.log('Emotional safety guardrails active.');
    });
  } catch (error: any) {
    console.error('❌ FATAL: Failed to start Holding Space Service:');
    console.error(`   - ${error.message || 'Unknown error'}`);
    process.exit(1);
  }
};

start();
