/**
 * TraceKit Vue Integration
 * @package @tracekit/vue
 *
 * Provides Vue-native error capture and navigation breadcrumbs
 * built on top of @tracekit/browser.
 *
 * Usage:
 *   import { TraceKitPlugin } from '@tracekit/vue';
 *   app.use(TraceKitPlugin, { apiKey: '...', router });
 */

// Re-export core SDK functions for convenience
export {
  captureException,
  captureMessage,
  setUser,
  setTag,
  setExtra,
  addBreadcrumb,
  getClient,
} from '@tracekit/browser';

// Vue-specific exports
export { TraceKitPlugin } from './plugin';
export { setupErrorHandler } from './errorhandler';
export { setupRouterBreadcrumbs } from './router';

// Types
export type { TraceKitVueOptions } from './types';
export type { ErrorHandlerOptions } from './errorhandler';
