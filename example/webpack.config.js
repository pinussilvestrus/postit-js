const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    bundle: ['./app/app.js']
  },
  output: {
    path: __dirname + '/public',
    filename: 'app.js'
  },
  module: {
    rules: [
      {
        test: /\.xml$/,
        use: 'raw-loader'
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: '**/*.{html,css}', context: 'app/' }
    ])
  ],
  mode: 'development',
  devtool: 'source-map'
};
