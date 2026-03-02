import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setupErrorHandler } from '../errorhandler';

// Mock @tracekit/browser
vi.mock('@tracekit/browser', () => ({
  captureException: vi.fn(),
}));

import { captureException } from '@tracekit/browser';

function createMockApp() {
  return {
    config: {
      errorHandler: null as Function | null,
    },
  } as any;
}

function createMockInstance(name?: string, __name?: string) {
  return {
    $options: {
      name: name || undefined,
      __name: __name || undefined,
    },
  } as any;
}

describe('setupErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls captureException with component name and lifecycle info', () => {
    const app = createMockApp();
    setupErrorHandler(app);

    const error = new Error('test error');
    const instance = createMockInstance('MyComponent');
    app.config.errorHandler(error, instance, 'mounted');

    expect(captureException).toHaveBeenCalledWith(error, {
      componentName: 'MyComponent',
      lifecycleHook: 'mounted',
      handled: true,
    });
  });

  it('extracts __name when name is not available', () => {
    const app = createMockApp();
    setupErrorHandler(app);

    const error = new Error('test error');
    const instance = createMockInstance(undefined, 'SFCComponent');
    app.config.errorHandler(error, instance, 'setup');

    expect(captureException).toHaveBeenCalledWith(error, {
      componentName: 'SFCComponent',
      lifecycleHook: 'setup',
      handled: true,
    });
  });

  it('uses Anonymous when no component name is available', () => {
    const app = createMockApp();
    setupErrorHandler(app);

    const error = new Error('test error');
    app.config.errorHandler(error, null, 'render');

    expect(captureException).toHaveBeenCalledWith(error, {
      componentName: 'Anonymous',
      lifecycleHook: 'render',
      handled: true,
    });
  });

  it('chains to previous errorHandler', () => {
    const app = createMockApp();
    const previousHandler = vi.fn();
    app.config.errorHandler = previousHandler;

    setupErrorHandler(app);

    const error = new Error('test error');
    const instance = createMockInstance('TestComp');
    app.config.errorHandler(error, instance, 'mounted');

    expect(previousHandler).toHaveBeenCalledWith(error, instance, 'mounted');
  });

  it('falls back to console.error when no previous handler', () => {
    const app = createMockApp();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    setupErrorHandler(app);

    const error = new Error('test error');
    app.config.errorHandler(error, null, 'render');

    expect(consoleError).toHaveBeenCalledWith(error);
    consoleError.mockRestore();
  });

  it('handles non-Error values without calling captureException', () => {
    const app = createMockApp();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    setupErrorHandler(app);

    const stringError = 'string error';
    app.config.errorHandler(stringError, null, 'render');

    expect(captureException).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledWith(stringError);
    consoleError.mockRestore();
  });

  it('calls onError callback when provided', () => {
    const app = createMockApp();
    const onError = vi.fn();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    setupErrorHandler(app, { onError });

    const error = new Error('test error');
    const instance = createMockInstance('TestComp');
    app.config.errorHandler(error, instance, 'mounted');

    expect(onError).toHaveBeenCalledWith(error, 'TestComp', 'mounted');
    consoleError.mockRestore();
  });
});
