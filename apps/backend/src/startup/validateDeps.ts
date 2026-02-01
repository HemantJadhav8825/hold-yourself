import axios from 'axios';
import { AUTH_CONFIG } from '../auth/auth.config';

export const validateDeps = async () => {
  console.log('🔍 Validating external dependencies...');

  try {
    // Check if Auth Service is reachable via its health endpoint
    await axios.get(`${AUTH_CONFIG.SERVICE_URL}/health`, { timeout: 2000 });
    console.log(`✅ Dependency check: Auth Service at ${AUTH_CONFIG.SERVICE_URL} is REACHABLE.`);
  } catch (err: any) {
    console.error(`❌ FATAL: Dependency check FAILED. Auth Service at ${AUTH_CONFIG.SERVICE_URL} is UNREACHABLE.`);
    console.error(`   Error: ${err.message}`);
    process.exit(1);
  }
};
