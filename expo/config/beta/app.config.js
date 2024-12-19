module.exports = (config) => {
  // the name displayed on the device,
  // DO NOT include multi byte characters which causes an issue on Android build.
  config.name = 'HELLO!FAN (Beta)';
  // the name used in Expo
  config.slug = 'hpapp';
  // the project ID provided by your EAS.
  config.extra.eas.projectId = 'a76e7e46-e508-43cf-93a8-1ae32871d4f7';

  // bundleID used in your Apple Developer Account
  config.ios.bundleIdentifier = 'dev.yssk22.hpapp.beta';
  // package name used in your Goolge Developer Account
  config.android.package = 'dev.yssk22.hpapp.beta.android';
  config.extra.hpapp.env = 'beta';
  config.extra.hpapp.isBeta = true;
  config.extra.hpapp.isDev = false;
  config.extra.hpapp.firebaseIOSClientID = '265427540400-kbuq50tafej5vhrtfdldi6ob61o0jrcu.apps.googleusercontent.com';
  config.extra.hpapp.firebaseAndroidClientID =
    '265427540400-hl4b6t82h8d9jg7eemovlsftrn0c6tog.apps.googleusercontent.com';

  config.updates.url = 'https://u.expo.dev/a76e7e46-e508-43cf-93a8-1ae32871d4f7';
  return config;
};
