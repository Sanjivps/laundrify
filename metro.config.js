// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('@expo/metro-config');
const { mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const defaultConfig = getDefaultConfig(__dirname);

// Add support for importing with proper module resolution
const customConfig = {
  resolver: {
    sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx', 'cjs'],
    assetExts: ['bmp', 'gif', 'jpg', 'jpeg', 'png', 'psd', 'svg', 'webp', 'ttf', 'otf'],
    disableHierarchicalLookup: true,
    nodeModulesPaths: [path.resolve(__dirname, 'node_modules')],
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName.startsWith('@/')) {
        const newModuleName = path.resolve(__dirname, moduleName.slice(2));
        return context.resolveRequest(context, newModuleName, platform);
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

// Merge configurations
module.exports = mergeConfig(defaultConfig, customConfig); 