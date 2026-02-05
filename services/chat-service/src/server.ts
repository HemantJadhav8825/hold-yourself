import app from './app';
import dotenv from 'dotenv';
import { connectDatabase } from './startup/database';

dotenv.config();

// Connect to Database
connectDatabase();

const port = process.env.PORT || 3200;

app.listen(port, () => {
  console.log(`Chat Service running on port ${port}`);
});
