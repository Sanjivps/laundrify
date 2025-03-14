const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Add support for require.context
  config.module.rules.push({
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        plugins: ['@babel/plugin-syntax-dynamic-import', 'babel-plugin-dynamic-import-node']
      }
    }
  });

  return config;
}; 