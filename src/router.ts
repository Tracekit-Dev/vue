import type { Router } from 'vue-router';
import { addBreadcrumb } from '@tracekit/browser';

/**
 * Set up Vue Router breadcrumbs that capture navigation events.
 *
 * Uses router.afterEach to capture from/to paths as breadcrumbs.
 * When parameterized is true (default), uses the route config pattern
 * (e.g., /users/:id) instead of the actual URL.
 */
export function setupRouterBreadcrumbs(
  router: Router,
  parameterized: boolean = true,
): void {
  router.afterEach((to, from) => {
    const toPath = parameterized
      ? to.matched?.[to.matched.length - 1]?.path ?? to.path
      : to.fullPath;
    const fromPath = parameterized
      ? from.matched?.[from.matched.length - 1]?.path ?? from.path
      : from.fullPath;

    addBreadcrumb({
      category: 'navigation',
      message: `${fromPath} -> ${toPath}`,
      data: { from: fromPath, to: toPath },
    });
  });
}
