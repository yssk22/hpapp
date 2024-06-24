jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
jest.mock('@react-native-async-storage/async-storage', () => {
  return require('@react-native-async-storage/async-storage/jest/async-storage-mock');
});

jest.mock('@react-native-firebase/app-check', () => {
  return () => ({
    newReactNativeFirebaseAppCheckProvider: () => {
      return {
        configure: jest.fn()
      };
    },
    initializeAppCheck: jest.fn(),
    getToken: jest.fn()
  });
});

jest.mock('expo-constants', () => {
  return {
    expoConfig: {
      extra: {
        hpapp: {
          useLocalAppConfig: false,
          useLocalAuth: true,
          graphQLEndpoint: 'http://localhost:8080/graphql/v3'
        }
      }
    }
  };
});

jest.useFakeTimers();
