const path = require('path');

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'relay',
      // https://github.com/facebook/metro/issues/877
      // ["@babel/plugin-proposal-private-methods", { loose: false }],
      // ["@babel/plugin-proposal-class-properties", { loose: false }],
      // ["@babel/plugin-proposal-private-property-in-object", { loose: false }],
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
          alias: {
            '@hpapp': path.resolve(__dirname, '.')
          }
        }
      ]
    ]
  };
};
