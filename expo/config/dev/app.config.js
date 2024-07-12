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
  config.android.package = 'dev.yssk22.hpapp.dev';
  config.extra.hpapp.env = 'dev';
  config.extra.hpapp.isBeta = false;
  config.extra.hpapp.isDev = true;
  // those id can be easily found in the URL in the browser in development build so we don't necessary put them into secrets.json
  config.extra.hpapp.firebaseIOSClientID = '265427540400-pq3vj6jg3p1pcrk55odp2v8k98l3jiir.apps.googleusercontent.com';
  config.extra.hpapp.firebaseAndroidClientID =
    '265427540400-58vl0q3shqllh738b5hb80m34d6deik1.apps.googleusercontent.com';
  return config;
};
