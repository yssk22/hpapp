const packageJson = require('./package.json');

function format(n) {
  if (n < 10) {
    return '0' + n.toString();
  }
  return n.toString();
}
const t = new Date();
const BUILD_NUMBER =
  t.getFullYear() + format(t.getMonth() + 1) + format(t.getDate()) + format(t.getHours()) + format(t.getMinutes());

// Automatically allocate version number based on the timestamp
// it is required to increment anyway when uploading the binary to the store so
// we don't want to use git revision as we may want to upload the binary before doing git `commit`.
// to test production features.
//
// Android versionCode has to be less than 2100000000
const IOS_BUILD_NUMBER = BUILD_NUMBER;
const ANDROID_VERSION_CODE = BUILD_NUMBER - 202301010000;

module.exports = {
  expo: {
    name: 'hpapp',
    slug: 'hpapp',
    scheme: 'hpapp',
    version: packageJson.version,
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      bundleIdentifier: 'app.helloproject.hpapp',
      buildNumber: IOS_BUILD_NUMBER,
      supportsTablet: true,
      config: {
        usesNonExemptEncryption: false
      },
      infoPlist: {
        CFBundleAllowMixedLocalizations: true,
        NSAppTransportSecurity: {
          NSExceptionDomains: {
            'helloproject.com': {
              NSIncludesSubdomains: true,
              NSExceptionAllowsInsecureHTTPLoads: true
            }
          }
        }
      }
    },
    android: {
      package: 'app.helloproject.hpapp',
      versionCode: ANDROID_VERSION_CODE,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff'
      }
    },
    web: {
      bundler: 'metro',
      favicon: './assets/favicon.png'
    },
    plugins: [
      '@react-native-firebase/app',
      'expo-localization',
      [
        'expo-build-properties',
        {
          ios: {
            useFrameworks: 'static'
          }
        }
      ],
      [
        'expo-asset',
        {
          assets: ['./assets']
        }
      ],
      [
        'expo-font',
        {
          fonts: ['./assets/BIZUDGothic_400Regular.ttf', './assets/BIZUDGothic_700Bold.ttf']
        }
      ]
    ],
    updates: {
      url: 'https://u.expo.dev/{eas-project-id}'
    },
    runtimeVersion: {
      policy: 'appVersion'
    },
    extra: {
      eas: {},
      hpapp: {
        useLocalAuth: false,
        graphQLEndpoint: 'http://localhost:8080/graphql/v3',
        firebaseIOSClientID: null,
        firebaseAndroidClientID: null
      }
    }
  }
};
