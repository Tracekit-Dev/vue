import type { App, ComponentPublicInstance } from 'vue';
import { captureException } from '@tracekit/browser';

export interface ErrorHandlerOptions {
  onError?: (err: Error, componentName: string, info: string) => void;
}

/**
 * Set up Vue error handler that captures errors to TraceKit.
 *
 * Preserves any existing error handler by chaining (not overwriting).
 * After capture, re-throws to the previous handler or falls back to console.error.
 */
export function setupErrorHandler(
  app: App,
  options?: ErrorHandlerOptions,
): void {
  const previousHandler = app.config.errorHandler;

  app.config.errorHandler = (
    err: unknown,
    instance: ComponentPublicInstance | null,
    info: string,
  ) => {
    const componentName =
      instance?.$options?.name ||
      instance?.$options?.__name ||
      'Anonymous';

    if (err instanceof Error) {
      captureException(err, {
        componentName,
        lifecycleHook: info,
        handled: true,
      });
    }

    options?.onError?.(err as Error, componentName, info);

    // Re-throw to previous handler or fall back to console.error
    if (previousHandler) {
      previousHandler(err, instance, info);
    } else {
      console.error(err);
    }
  };
}
