import express from 'express';
import cors from 'cors';
import conversationRoutes from './modules/conversations/conversation.routes';
import messageRoutes from './modules/messages/message.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'chat-service' }));

// Routes
app.use('/v1/conversations', conversationRoutes);
app.use('/v1/messages', messageRoutes);

export default app;
