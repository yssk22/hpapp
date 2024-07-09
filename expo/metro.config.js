const { generate } = require('@storybook/react-native/scripts/generate');
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

generate({
  configPath: path.resolve(__dirname, './.storybook')
});

const config = getDefaultConfig(__dirname);
config.resolver.projectRoot = path.dirname(__dirname);
config.resolver.alias = {
  '@hpapp': path.resolve(__dirname, '.')
};
config.resolver.assetExts.push('cjs');

config.resolver.sourceExts.push('mjs');
config.transformer.unstable_allowRequireContext = true;

module.exports = config;
