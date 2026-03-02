import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock @tracekit/browser
vi.mock('@tracekit/browser', () => ({
  init: vi.fn(),
  captureException: vi.fn(),
  addBreadcrumb: vi.fn(),
}));

// Mock the internal modules
vi.mock('../errorhandler', () => ({
  setupErrorHandler: vi.fn(),
}));

vi.mock('../router', () => ({
  setupRouterBreadcrumbs: vi.fn(),
}));

import { init } from '@tracekit/browser';
import { setupErrorHandler } from '../errorhandler';
import { setupRouterBreadcrumbs } from '../router';
import { TraceKitPlugin } from '../plugin';

function createMockApp() {
  return {
    config: {
      errorHandler: null,
    },
  } as any;
}

function createMockRouter() {
  return {
    afterEach: vi.fn(),
  } as any;
}

describe('TraceKitPlugin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls init() with options', () => {
    const app = createMockApp();
    const options = { apiKey: 'test-key', environment: 'test' };

    TraceKitPlugin.install!(app, options);

    expect(init).toHaveBeenCalledWith(options);
  });

  it('sets up error handler', () => {
    const app = createMockApp();
    const options = { apiKey: 'test-key' };

    TraceKitPlugin.install!(app, options);

    expect(setupErrorHandler).toHaveBeenCalledWith(app);
  });

  it('sets up router breadcrumbs when router option provided', () => {
    const app = createMockApp();
    const router = createMockRouter();
    const options = { apiKey: 'test-key', router };

    TraceKitPlugin.install!(app, options);

    expect(setupRouterBreadcrumbs).toHaveBeenCalledWith(router, true);
  });

  it('does not set up router breadcrumbs when no router option', () => {
    const app = createMockApp();
    const options = { apiKey: 'test-key' };

    TraceKitPlugin.install!(app, options);

    expect(setupRouterBreadcrumbs).not.toHaveBeenCalled();
  });

  it('respects parameterizedRoutes option', () => {
    const app = createMockApp();
    const router = createMockRouter();
    const options = {
      apiKey: 'test-key',
      router,
      parameterizedRoutes: false,
    };

    TraceKitPlugin.install!(app, options);

    expect(setupRouterBreadcrumbs).toHaveBeenCalledWith(router, false);
  });
});
