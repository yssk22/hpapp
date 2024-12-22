const fs = require('fs');
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

  const isEAS = process.env.EAS_BUILD === 'true';
  const easEnvvarPrefix = cfgName.toUpperCase() + '_';
  const iosGoogleServicesFilePath = isEAS
    ? process.env[easEnvvarPrefix + 'GOOGLE_SERVICES_INFO_PLIST']
    : path.join('config', cfgName, 'GoogleService-Info.plist');
  const androidGoogleServicesFilePath = isEAS
    ? process.env[easEnvvarPrefix + 'GOOGLE_SERVICES_JSON']
    : path.join('config', cfgName, 'google-services.json');

  if (fs.existsSync(iosGoogleServicesFilePath)) {
    config.ios.googleServicesFile = iosGoogleServicesFilePath;
  } else {
    if (isEAS) {
      throw new Error('GoogleService-Info.plist file does not found in ' + iosGoogleServicesFilePath);
    }
  }
  if (fs.existsSync(androidGoogleServicesFilePath)) {
    config.android.googleServicesFile = androidGoogleServicesFilePath;
  } else {
    if (isEAS) {
      throw new Error('google-services.json file does not found in ' + androidGoogleServicesFilePath);
    }
  }

  // finally load the environment specific app.config.js
  const configure = require('./' + path.join('config', cfgName, 'app.config.js'));

  // reserverd extra configurations
  config.extra.hpapp.isEAS = isEAS;
  return configure(config);
};
