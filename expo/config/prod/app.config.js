module.exports = (config) => {
  // the name displayed on the device,
  // DO NOT include multi byte characters which causes an issue on Android build.
  config.name = 'HELLO!FAN';
  // the name used in Expo
  config.slug = 'hpapp';
  // the project ID provided by your EAS.
  config.extra.eas.projectId = 'a76e7e46-e508-43cf-93a8-1ae32871d4f7';

  // bundleID used in your Apple Developer Account
  config.ios.bundleIdentifier = 'dev.yssk22.hpapp';
  // package name used in your Goolge Developer Account
  config.android.package = 'dev.yssk22.hpapp';
  config.extra.hpapp.env = 'prd';
  config.extra.hpapp.isBeta = false;
  config.extra.hpapp.isDev = false;
  // those id can be easily found in the URL in the browser in development build so we don't necessary put them into secrets.json
  config.extra.hpapp.firebaseIOSClientID = '265427540400-um42nfj6a2d2i59u7j01pmgpijmqk1oc.apps.googleusercontent.com';
  config.extra.hpapp.firebaseAndroidClientID =
    '265427540400-83oj9vqhc5o3srj9pvh5d9e9hkfmnmdg.apps.googleusercontent.com';
  return config;
};