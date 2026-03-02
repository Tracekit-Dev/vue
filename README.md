# @tracekit/vue

TraceKit Vue Integration -- Error capture and navigation breadcrumbs for Vue 3.

## Installation

```bash
npm install @tracekit/vue @tracekit/browser
```

## Quick Start

```js
import { createApp } from 'vue';
import { init } from '@tracekit/browser';
import { createTraceKitVuePlugin } from '@tracekit/vue';

init({ dsn: 'https://your-dsn@tracekit.dev/1' });

const app = createApp(App);
app.use(createTraceKitVuePlugin());
app.mount('#app');
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `trackComponents` | `boolean` | `true` | Track component names in error reports |
| `hooks` | `string[]` | `['mount', 'update']` | Vue lifecycle hooks to instrument |

## Documentation

Full documentation: [https://app.tracekit.dev/docs/frontend/frameworks](https://app.tracekit.dev/docs/frontend/frameworks)

## License

MIT
