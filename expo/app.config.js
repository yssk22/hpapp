const path = require('path');

const config = require('./app.config.default').expo;

module.exports = (_) => {
  const cfgName = process.env['HPAPP_CONFIG_NAME'];
  if (cfgName === undefined || cfgName === '') {
    throw new Error('HPAPP_CONFIG_NAME has to be specified in eas.json OR environment variable');
  }

  // set resources located in config/{name}/ directory
  config.icon = path.join('config', cfgName, 'icon.png');
  config.splash.image = path.join('config', cfgName, 'splash.png');
  config.ios.googleServicesFile = path.join('config', cfgName, 'GoogleService-Info.plist');
  config.android.googleServicesFile = path.join('config', cfgName, 'google-services.json');

  // finally load the environment specific app.config.js
  const configure = require('./' + path.join('config', cfgName, 'app.config.js'));

  // reserverd extra configurations
  return configure(config);
};
