import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setupRouterBreadcrumbs } from '../router';

// Mock @tracekit/browser
vi.mock('@tracekit/browser', () => ({
  addBreadcrumb: vi.fn(),
}));

import { addBreadcrumb } from '@tracekit/browser';

function createMockRouter() {
  let afterEachCallback: Function | null = null;
  return {
    afterEach(cb: Function) {
      afterEachCallback = cb;
    },
    trigger(to: any, from: any) {
      afterEachCallback?.(to, from);
    },
  };
}

function createRoute(path: string, fullPath: string, matchedPath?: string) {
  return {
    path,
    fullPath,
    matched: matchedPath
      ? [{ path: matchedPath }]
      : [],
  };
}

describe('setupRouterBreadcrumbs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('adds breadcrumb on afterEach with from/to', () => {
    const router = createMockRouter();
    setupRouterBreadcrumbs(router as any);

    const to = createRoute('/users/123', '/users/123', '/users/:id');
    const from = createRoute('/dashboard', '/dashboard', '/dashboard');
    router.trigger(to, from);

    expect(addBreadcrumb).toHaveBeenCalledWith({
      category: 'navigation',
      message: '/dashboard -> /users/:id',
      data: { from: '/dashboard', to: '/users/:id' },
    });
  });

  it('uses parameterized paths when option is true', () => {
    const router = createMockRouter();
    setupRouterBreadcrumbs(router as any, true);

    const to = createRoute('/users/456', '/users/456?tab=profile', '/users/:id');
    const from = createRoute('/settings', '/settings', '/settings');
    router.trigger(to, from);

    expect(addBreadcrumb).toHaveBeenCalledWith({
      category: 'navigation',
      message: '/settings -> /users/:id',
      data: { from: '/settings', to: '/users/:id' },
    });
  });

  it('uses fullPath when parameterized is false', () => {
    const router = createMockRouter();
    setupRouterBreadcrumbs(router as any, false);

    const to = createRoute('/users/123', '/users/123?tab=profile', '/users/:id');
    const from = createRoute('/dashboard', '/dashboard?page=1', '/dashboard');
    router.trigger(to, from);

    expect(addBreadcrumb).toHaveBeenCalledWith({
      category: 'navigation',
      message: '/dashboard?page=1 -> /users/123?tab=profile',
      data: { from: '/dashboard?page=1', to: '/users/123?tab=profile' },
    });
  });

  it('falls back to path when no matched routes', () => {
    const router = createMockRouter();
    setupRouterBreadcrumbs(router as any, true);

    const to = { path: '/unknown', fullPath: '/unknown', matched: [] };
    const from = { path: '/home', fullPath: '/home', matched: [] };
    router.trigger(to, from);

    expect(addBreadcrumb).toHaveBeenCalledWith({
      category: 'navigation',
      message: '/home -> /unknown',
      data: { from: '/home', to: '/unknown' },
    });
  });
});
