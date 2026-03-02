import type { Plugin, App } from 'vue';
import { init } from '@tracekit/browser';
import type { TraceKitVueOptions } from './types';
import { setupErrorHandler } from './errorhandler';
import { setupRouterBreadcrumbs } from './router';

/**
 * TraceKit Vue Plugin.
 *
 * Auto-initializes @tracekit/browser via init() and sets up
 * Vue error handler with component name + lifecycle context.
 * Optionally sets up Vue Router navigation breadcrumbs.
 *
 * Usage:
 *   app.use(TraceKitPlugin, { apiKey: '...', router });
 */
export const TraceKitPlugin: Plugin = {
  install(app: App, options: TraceKitVueOptions) {
    // Auto-initialize the browser SDK
    init(options);

    // Set up Vue error handler
    setupErrorHandler(app);

    // Set up router breadcrumbs if router is provided
    if (options.router) {
      setupRouterBreadcrumbs(
        options.router,
        options.parameterizedRoutes ?? true,
      );
    }
  },
};
