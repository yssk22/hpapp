module.exports = (config) => {
  // the name displayed on the device,
  // DO NOT include multi byte characters which causes an issue on Android build.
  config.name = 'HELLO!FAN (DEV)';
  // the name used in Expo
  config.slug = 'hpapp';
  // the project ID provided by your EAS.
  config.extra.eas.projectId = 'a76e7e46-e508-43cf-93a8-1ae32871d4f7';

  // bundleID used in your Apple Developer Account
  config.ios.bundleIdentifier = 'dev.yssk22.hpapp.dev';
  // package name used in your Goolge Developer Account
  config.android.package = 'dev.yssk22.hpapp.dev.android';
  config.extra.hpapp.env = 'dev';
  config.extra.hpapp.isBeta = false;
  config.extra.hpapp.isDev = true;
  // those id can be easily found in the URL in the browser in development
  config.extra.hpapp.firebaseIOSClientID = '265427540400-pq3vj6jg3p1pcrk55odp2v8k98l3jiir.apps.googleusercontent.com';
  config.extra.hpapp.firebaseAndroidClientID =
    '265427540400-uomdcbi3g35i3242t7pkua8fhtvppnmq.apps.googleusercontent.com';
  return config;
};
