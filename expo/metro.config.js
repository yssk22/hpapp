const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);
config.resolver.projectRoot = path.dirname(__dirname);
config.resolver.alias = {
  '@hpapp': path.resolve(__dirname, '.')
};
config.resolver.assetExts.push('cjs');

module.exports = config;
