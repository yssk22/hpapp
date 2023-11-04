module.exports = (config) => {
  // the name displayed on the device,
  // DO NOT include multi byte characters which causes an issue on Android build.
  config.name = 'HELLO!FAN (Beta)';
  // the name used in Expo
  config.slug = 'hpapp-beta';
  // the project ID provided by your EAS.
  config.extra.eas.projectId = 'a02053d4-d2a0-44d4-9c98-9eba39f8f3a8';

  // bundleID used in your Apple Developer Account
  config.ios.bundleIdentifier = 'dev.yssk22.hpapp.beta';
  // package name used in your Goolge Developer Account
  config.android.package = 'dev.yssk22.hpapp.beta';
  config.extra.hpapp.env = 'beta';
  config.extra.hpapp.isBeta = false;
  config.extra.hpapp.isDev = true;

  config.updates.url = 'https://u.expo.dev/a02053d4-d2a0-44d4-9c98-9eba39f8f3a8';
  return config;
};
