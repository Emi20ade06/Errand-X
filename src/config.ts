// Environment Configuration Module
// Accesses variables securely loaded via Vite's public prefix pattern or server context fallback.

export const CONFIG = {
  // Public application URL (prefixed with VITE_ for client accessibility)
  appUrl: import.meta.env.VITE_APP_URL || 'http://localhost:3000',

  // API gateway endpoint configuration
  apiEndpoint: import.meta.env.VITE_API_GATEWAY_URL || '/api',

  // Feature toggle flags managed entirely through environment variables
  enableAIAssistant: import.meta.env.VITE_ENABLE_AI === 'true',

  // Is running in production or development
  isProd: import.meta.env.PROD,
};
