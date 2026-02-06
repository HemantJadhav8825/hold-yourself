/**
 * Environment Variable Validation
 * 
 * This file validates all required NEXT_PUBLIC_* environment variables at build time.
 * If any required variable is missing, the build will fail with a clear error message.
 */

// Define all required environment variables
const requiredEnvVars = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_CHAT_API_URL: process.env.NEXT_PUBLIC_CHAT_API_URL,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  NEXT_PUBLIC_GOOGLE_REDIRECT_URI: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
} as const;

// Validate environment variables
const missingVars: string[] = [];
const emptyVars: string[] = [];

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (value === undefined) {
    missingVars.push(key);
  } else if (value.trim() === '') {
    emptyVars.push(key);
  }
});

// Throw detailed error if any variables are missing or empty
if (missingVars.length > 0 || emptyVars.length > 0) {
  const errorMessages: string[] = [
    '❌ Environment Variable Validation Failed!',
    '',
    'The following required environment variables are not properly configured:',
    '',
  ];

  if (missingVars.length > 0) {
    errorMessages.push('🔴 Missing variables (not defined):');
    missingVars.forEach(varName => {
      errorMessages.push(`   - ${varName}`);
    });
    errorMessages.push('');
  }

  if (emptyVars.length > 0) {
    errorMessages.push('🟡 Empty variables (defined but empty):');
    emptyVars.forEach(varName => {
      errorMessages.push(`   - ${varName}`);
    });
    errorMessages.push('');
  }

  errorMessages.push('📋 Required environment variables:');
  errorMessages.push('   - NEXT_PUBLIC_SITE_URL          (e.g., https://webelong.world)');
  errorMessages.push('   - NEXT_PUBLIC_API_URL           (e.g., https://api.webelong.world)');
  errorMessages.push('   - NEXT_PUBLIC_CHAT_API_URL      (e.g., https://api.webelong.world)');
  errorMessages.push('   - NEXT_PUBLIC_GOOGLE_CLIENT_ID  (Google OAuth Client ID)');
  errorMessages.push('   - NEXT_PUBLIC_GOOGLE_REDIRECT_URI (e.g., https://webelong.world/login)');
  errorMessages.push('');
  errorMessages.push('💡 Fix:');
  errorMessages.push('   1. Check your .env.local file');
  errorMessages.push('   2. Ensure all variables are defined');
  errorMessages.push('   3. Run: pnpm build');
  errorMessages.push('');

  throw new Error('\n' + errorMessages.join('\n'));
}

// Export validated environment variables
export const env = {
  NEXT_PUBLIC_SITE_URL: requiredEnvVars.NEXT_PUBLIC_SITE_URL as string,
  NEXT_PUBLIC_API_URL: requiredEnvVars.NEXT_PUBLIC_API_URL as string,
  NEXT_PUBLIC_CHAT_API_URL: requiredEnvVars.NEXT_PUBLIC_CHAT_API_URL as string,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: requiredEnvVars.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
  NEXT_PUBLIC_GOOGLE_REDIRECT_URI: requiredEnvVars.NEXT_PUBLIC_GOOGLE_REDIRECT_URI as string,
} as const;

// Log environment info in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔧 [ENV] Environment variables loaded:', {
    siteUrl: env.NEXT_PUBLIC_SITE_URL,
    apiUrl: env.NEXT_PUBLIC_API_URL,
    chatApiUrl: env.NEXT_PUBLIC_CHAT_API_URL,
    hasGoogleClientId: !!env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    redirectUri: env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
  });
}

export type Env = typeof env;
