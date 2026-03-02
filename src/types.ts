import type { TracekitBrowserConfig } from '@tracekit/browser';
import type { Router } from 'vue-router';

export interface TraceKitVueOptions extends TracekitBrowserConfig {
  router?: Router;
  parameterizedRoutes?: boolean; // default: true
}
