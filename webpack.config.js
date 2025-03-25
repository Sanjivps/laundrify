const path = require('path');

module.exports = {
  mode: 'development',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-expo'],
            plugins: ['@babel/plugin-syntax-dynamic-import', 'babel-plugin-dynamic-import-node']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname),
      '@components': path.resolve(__dirname, 'components'),
      '@data': path.resolve(__dirname, 'data'),
    }
  }
}; 