import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/requireAuth';

import axios from 'axios';
import { AUTH_CONFIG } from '../auth/auth.config';
import { APP_CONFIG } from '../config/app.config';

const router = Router();
const AUTH_SERVICE_URL = AUTH_CONFIG.SERVICE_URL;
const HOLDING_SPACE_SERVICE_URL = AUTH_CONFIG.HOLDING_SPACE_SERVICE_URL;

// Public health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'backend-gateway' });
});

// Manual Shares Proxy (Public Feed / Emotion Feed)
router.get('/v1/shares', async (req, res) => {
  const HOLDING_SPACE_SERVICE_URL = AUTH_CONFIG.HOLDING_SPACE_SERVICE_URL;
  try {
    const url = `${HOLDING_SPACE_SERVICE_URL}${req.originalUrl}`;

    // Explicitly do NOT send Authorization header if it's not needed by public HSS endpoint
    // But we pass it if present, in case user is logged in
    const headers: any = {};
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
    }

    const response = await axios({
      method: 'GET',
      url: url,
      params: req.query,
      headers: headers
    });

    res.status(response.status).json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: 'Holding Space Service unavailable' };
    res.status(status).json(data);
  }
});

// Public Permalink Exception (Marketing/SEO)
router.get('/v1/shares/:id', async (req, res) => {
  const HOLDING_SPACE_SERVICE_URL = AUTH_CONFIG.HOLDING_SPACE_SERVICE_URL;

  // Only handle 24-char hex IDs
  if (!/^[a-f\d]{24}$/i.test(req.params.id)) {
    return res.status(404).json({ error: 'Invalid share ID' });
  }

  try {
    const url = `${HOLDING_SPACE_SERVICE_URL}${req.originalUrl}`;
    const response = await axios.get(url, {
      params: req.query
    });
    res.status(response.status).json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: 'Holding Space Service unavailable' };
    res.status(status).json(data);
  }
});

// GET /v1/users (list)
router.get('/v1/users', requireAuth, async (req, res) => {
  try {
    const { limit, offset } = req.query;
    const response = await axios.get(`${AUTH_SERVICE_URL}/v1/users`, {
      params: { limit, offset }
    });
    res.json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || 'Failed to fetch users';
    res.status(status).json({ error: message });
  }
});

// GET /v1/users/profile (expanded)
router.get('/v1/users/profile', requireAuth, async (req, res) => {
  try {
    // Forward the request to the dedicated profile endpoint in Auth Service
    // We MUST forward the Authorization header so Auth Service can identify the user
    // and return private fields like anonymousProfile
    // Forward the request to the dedicated profile endpoint in Auth Service
    // We MUST forward the Authorization header so Auth Service can identify the user
    // and return private fields like anonymousProfile
    const url = `${AUTH_SERVICE_URL}/v1/users/profile`;
    console.log(`[Proxy] Fetching profile from: ${url}`);

    const response = await axios.get(url, {
      headers: {
        Authorization: req.headers.authorization
      }
    });
    res.json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || 'Failed to fetch profile';
    res.status(status).json({ error: message });
  }
});

// PATCH /v1/users/profile (update)
router.patch('/v1/users/profile', requireAuth, async (req, res) => {
  try {
    const response = await axios.patch(`${AUTH_SERVICE_URL}/v1/users/profile`, req.body, {
      headers: {
        Authorization: req.headers.authorization
      }
    });
    res.json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || 'Failed to update profile';
    res.status(status).json({ error: message });
  }
});

// Admin only route example
router.get('/v1/admin/stats', requireAuth, requireRole('admin'), (req, res) => {
  res.json({
    message: 'Welcome, Admin',
    stats: { users: 42, activeUsers: 7 }
  });
});

// Anonymous User Creation (Auth Service)
router.post('/v1/users/anonymous', requireAuth, async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/v1/users/anonymous`, req.body, {
      headers: {
        Authorization: req.headers.authorization
      }
    });
    res.json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || 'Failed to create anonymous profile';
    res.status(status).json({ error: message });
  }
});

// Chat Service Proxy
const CHAT_SERVICE_URL = AUTH_CONFIG.CHAT_SERVICE_URL;

// Circles (list, create, join, leave)
router.use('/v1/circles', requireAuth, async (req, res, next) => {
  if (!APP_CONFIG.SANCTUARY_ENABLED) {
    return res.status(404).json({ error: 'Not Found' });
  }
  next();
}, async (req, res) => {
  try {
    const url = `${CHAT_SERVICE_URL}/v1/circles${req.url === '/' ? '' : req.url}`;
    const response = await axios({
      method: req.method,
      url: url,
      data: req.method !== 'GET' ? req.body : undefined,
      params: req.query,
      headers: {
        Authorization: req.headers.authorization
      }
    });
    res.json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || 'Chat Service Error';
    res.status(status).json({ error: message });
  }
});

// Vents (list - PUBLIC)
router.get('/v1/vents', async (req, res) => {
  if (!APP_CONFIG.SANCTUARY_ENABLED) {
    return res.status(404).json({ error: 'Not Found' });
  }
  try {
    const url = `${CHAT_SERVICE_URL}/v1/vents${req.url === '/' ? '' : req.url}`;
    // Pass specific header to indicate public access if needed, or just forward without auth for public endpoints
    // If chat service requires auth even for GET, we might need a machine-to-machine token or similar.
    // However, the plan assumes chat service handles public GET or valid logic matches implementation plan.
    // For now, we forward without specific auth headers if req.headers.authorization is missing.
    const response = await axios({
      method: 'GET',
      url: url,
      params: req.query,
      headers: {
        ...(req.headers.authorization ? { Authorization: req.headers.authorization } : {})
      }
    });
    res.json(response.data);
  } catch (error: any) {
    const realError = {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      url: `${CHAT_SERVICE_URL}/v1/vents`
    }
    console.error('Chat Service Proxy Error (GET /vents):', realError);
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || 'Chat Service Error';
    res.status(status).json({ error: JSON.stringify(realError, null, 2) });
  }
});

// Vents (PROCTESTED - create, react)
router.use('/v1/vents', requireAuth, async (req, res, next) => {
  if (!APP_CONFIG.SANCTUARY_ENABLED) {
    return res.status(404).json({ error: 'Not Found' });
  }
  next();
}, async (req, res) => {
  try {
    const url = `${CHAT_SERVICE_URL}/v1/vents${req.url === '/' ? '' : req.url}`;
    const response = await axios({
      method: req.method,
      url: url,
      data: req.method !== 'GET' ? req.body : undefined, // GET is handled above, but just in case
      params: req.query,
      headers: {
        Authorization: req.headers.authorization
      }
    });
    res.json(response.data);
  } catch (error: any) {
    const realError = {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      url: `${CHAT_SERVICE_URL}/v1/vents${req.url === '/' ? '' : req.url}`
    }
    console.error('Chat Service Proxy Error:', realError);
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || 'Chat Service Error';
    res.status(status).json({ error: JSON.stringify(realError, null, 2) });
  }
});


const holdingSpaceRoutes = [
  '/v1/reports',
  '/v1/block',
  '/v1/preferences',
  '/v1/internal/moderation'
];

// Manual Shares Proxy (Protected Feed)
// Manual Shares Proxy (Public Feed / Emotion Feed)


// Manual Shares Proxy (Protected - Create, etc)
router.use('/v1/shares', requireAuth, async (req, res) => {
  try {
    const url = `${HOLDING_SPACE_SERVICE_URL}${req.originalUrl}`;
    const response = await axios({
      method: req.method,
      url: url,
      data: req.method !== 'GET' ? req.body : undefined, // GET handled above
      params: req.query,
      headers: {
        Authorization: req.headers.authorization,
        ...(req.headers['content-type'] ? { 'Content-Type': req.headers['content-type'] } : {})
      }
    });

    res.status(response.status).json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: 'Holding Space Service unavailable' };
    res.status(status).json(data);
  }
});

// Comments Proxy (Interaction Layer)
router.use('/v1/shares/:id/comments', requireAuth, async (req, res) => {
  try {
    const url = `${HOLDING_SPACE_SERVICE_URL}${req.originalUrl}`;
    const response = await axios({
      method: req.method,
      url: url,
      data: req.method !== 'GET' ? req.body : undefined,
      params: req.query,
      headers: {
        Authorization: req.headers.authorization,
        ...(req.headers['content-type'] ? { 'Content-Type': req.headers['content-type'] } : {})
      }
    });

    res.status(response.status).json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: 'Holding Space Service unavailable' };
    res.status(status).json(data);
  }
});

// Comments Proxy (Interaction Layer)
router.use('/v1/shares/:id/comments', requireAuth, async (req, res) => {
  try {
    const url = `${HOLDING_SPACE_SERVICE_URL}${req.originalUrl}`;
    const response = await axios({
      method: req.method,
      url: url,
      data: req.method !== 'GET' ? req.body : undefined,
      params: req.query,
      headers: {
        Authorization: req.headers.authorization,
        ...(req.headers['content-type'] ? { 'Content-Type': req.headers['content-type'] } : {})
      }
    });

    res.status(response.status).json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { error: 'Holding Space Service unavailable' };
    res.status(status).json(data);
  }
});

export default router;
