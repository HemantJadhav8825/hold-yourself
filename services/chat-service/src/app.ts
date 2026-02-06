import express from 'express';
import cors from 'cors';
import conversationRoutes from './modules/conversations/conversation.routes';
import messageRoutes from './modules/messages/message.routes';
import settingsRoutes from './modules/settings/settings.routes';
import moderationRoutes from './modules/moderation/moderation.routes';
import featureFlagRoutes from './modules/feature-flags/feature-flags.routes';

const app = express();

app.use(cors({
  origin: [
    'https://webelong.world',
    'https://chat.webelong.world',
    'https://api.webelong.world',
    'http://localhost:3002',
    'http://localhost:3000',
  ],
  credentials: true,
}));
app.use(express.json());

// Health Check
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'chat-service' }));

// Routes
app.use('/v1/conversations', conversationRoutes);
app.use('/v1/messages', messageRoutes);
app.use('/v1/settings', settingsRoutes);
app.use('/v1/moderation', moderationRoutes);
app.use('/v1/admin/feature-flags', featureFlagRoutes);

export default app;
