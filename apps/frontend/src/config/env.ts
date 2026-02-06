/**
 * Strict Environment Variable Validation
 * 
 * This module validates all required environment variables at import time.
 * The build WILL FAIL if any required variable is missing or empty.
 * 
 * NO DEFAULTS. NO FALLBACKS. NO RUNTIME-ONLY CHECKS.
 */

// Define all required environment variables
const REQUIRED_ENV_VARS = [
  'PORT',
  'NEXT_PUBLIC_API_URL',
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_GOOGLE_CLIENT_ID',
  'NEXT_PUBLIC_GOOGLE_REDIRECT_URI',
  'NEXT_PUBLIC_CHAT_SERVICE_URL',
  'NEXT_PUBLIC_CHAT_API_URL',
  'ALLOWED_DEV_ORIGINS',
] as const;

type RequiredEnvVar = typeof REQUIRED_ENV_VARS[number];

/**
 * Validates environment variables at import time.
 * Throws an error and aborts the build if any required variable is missing or empty.
 */
function validateEnvironment(): void {
  const missingVars: string[] = [];
  const emptyVars: string[] = [];

  for (const varName of REQUIRED_ENV_VARS) {
    const value = process.env[varName];

    if (value === undefined) {
      missingVars.push(varName);
    } else if (value.trim() === '') {
      emptyVars.push(varName);
    }
  }

  if (missingVars.length > 0 || emptyVars.length > 0) {
    console.error('\n❌ ENVIRONMENT VALIDATION FAILED\n');
    console.error('━'.repeat(60));

    if (missingVars.length > 0) {
      console.error('\n🚨 Missing environment variables:');
      missingVars.forEach(varName => {
        console.error(`   • ${varName}`);
      });
    }

    if (emptyVars.length > 0) {
      console.error('\n🚨 Empty environment variables:');
      emptyVars.forEach(varName => {
        console.error(`   • ${varName}`);
      });
    }

    console.error('\n━'.repeat(60));
    console.error('\n💡 Required environment variables:');
    REQUIRED_ENV_VARS.forEach(varName => {
      console.error(`   • ${varName}`);
    });
    console.error('\n━'.repeat(60));
    console.error('\n📝 Please ensure all required variables are set in:');
    console.error('   • .env.local (local development)');
    console.error('   • .env (CI/Docker)');
    console.error('   • Vercel dashboard (production)\n');

    throw new Error('Build aborted: Required environment variables are missing or empty.');
  }
}

// Execute validation immediately at import time
validateEnvironment();

/**
 * Typed environment object for safe usage across the application.
 * All values are guaranteed to be non-empty strings after validation.
 */
export const env = {
  PORT: process.env.PORT!,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL!,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL!,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
  NEXT_PUBLIC_GOOGLE_REDIRECT_URI: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
  NEXT_PUBLIC_CHAT_SERVICE_URL: process.env.NEXT_PUBLIC_CHAT_SERVICE_URL!,
  NEXT_PUBLIC_CHAT_API_URL: process.env.NEXT_PUBLIC_CHAT_API_URL!,
  ALLOWED_DEV_ORIGINS: process.env.ALLOWED_DEV_ORIGINS!,
} as const;

export type Env = typeof env;
