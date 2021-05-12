import { defineConfig } from 'vite';

import { string } from 'rollup-plugin-string';

import viteSentry from 'vite-plugin-sentry';

const SENTRY_DSN = process.env.SENTRY_DSN;
const SOURCE_VERSION = process.env.SOURCE_VERSION || process.env.npm_package_gitHead || 'dev';


function sentryIntegration() {

  if (SENTRY_DSN && SOURCE_VERSION) {
    return [
      viteSentry({
        release: SOURCE_VERSION,
        include: '.',
        ignore: ['node_modules', 'vite.config.js', '*sentry.js'],
      })
    ];
  }

  return [];
}

export default defineConfig({

  plugins: [
    string({
      include: '**/*.xml'
    }),
    sentryIntegration()
  ]
});