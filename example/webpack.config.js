const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const SentryWebpackPlugin = require('@sentry/webpack-plugin');

const SENTRY_DSN = process.env.SENTRY_DSN;
const SOURCE_VERSION = process.env.SOURCE_VERSION || process.env.npm_package_gitHead || 'dev';

module.exports = {
  entry: {
    bundle: ['./app/app.js'],
  },
  output: {
    path: __dirname + '/public',
    filename: 'app.js',
  },
  module: {
    rules: [
      {
        test: /\.xml$/,
        use: 'raw-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: ['file-loader'],
      },
      {
        test: /\.less$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      }
    ],
  },
  plugins: [
    new CopyWebpackPlugin({ patterns: [{ from: '**/*.{html,css,woff,ttf,eot,svg,woff2}', context: 'app/' }] }),
    new webpack.DefinePlugin({
      'process.env.SENTRY_DSN': JSON.stringify(SENTRY_DSN || null),
      'process.env.SOURCE_VERSION': JSON.stringify(SOURCE_VERSION || null)
    }),
    ...sentryIntegration()
  ],
  mode: 'development',
  devtool: 'source-map',
};

function sentryIntegration() {

  if (SENTRY_DSN && SOURCE_VERSION) {
    return [
      new SentryWebpackPlugin({
        release: SOURCE_VERSION,
        include: '.',
        ignore: ['node_modules', 'webpack.config.js', '*sentry.js'],
      })
    ];
  }

  return [];
}
