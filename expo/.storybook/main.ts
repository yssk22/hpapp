const webpack = require('webpack');
/** @type{import("@storybook/react-webpack5").StorybookConfig} */
module.exports = {
  stories: ['../features/**/*.stories.mdx', '../features/**/*.stories.@(js|jsx|ts|tsx)'],
  // stories: ['./debug/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-viewport',
    {
      name: '@storybook/addon-react-native-web',
      options: {
        modulesToTranspile: ['@expo/vector-icons']
      }
    }
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },
  docs: {
    autodocs: true
  },
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.html$/,
      use: 'ignore-loader'
    });
    config.plugins.push(
      ...config.plugins.filter((plugin) => !plugin.definitions),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development'),
        'process.env.NODE_PATH': JSON.stringify([]),
        'process.env.STORYBOOK': JSON.stringify('true'),
        'process.env.PUBLIC_PATH': JSON.stringify('.'),
        'process.env.HPAPP_USER_TOKEN_FOR_JEST': JSON.stringify(process.env.HPAPP_USER_TOKEN_FOR_JEST),
        'process.env.HPAPP_GRAPHQL_ENDPOINT_FOR_JEST': JSON.stringify('http://localhost:8080/graphql/v3')
      })
    );
    return config;
  }
};
