import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';
jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

jest.mock('expo-asset', () => ({
  useAssets: jest.fn((moduleIds: number | number[]) => {
    if (typeof moduleIds === 'number') {
      return [
        {
          uri: `asset-${moduleIds}`,
          height: 100,
          width: 100
        }
      ];
    }
    return [
      moduleIds.map((id, index) => {
        return {
          uri: `asset-${id}`,
          height: 100,
          width: 100
        };
      })
    ];
  })
}));
jest.mock('expo-font', () => ({}));
jest.mock('expo-dev-menu', () => {
  return {
    registerDevMenuItems: jest.fn()
  };
});

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
jest.mock('@react-native-async-storage/async-storage', () => {
  return require('@react-native-async-storage/async-storage/jest/async-storage-mock');
});

jest.mock('expo-secure-store', () => {
  // mock by async storage mock
  const mock = require('@react-native-async-storage/async-storage/jest/async-storage-mock');
  return {
    getItemAsync: jest.fn((key) => {
      return mock.getItem(key);
    }),
    setItemAsync: jest.fn((key, value) => {
      return mock.setItem(key, value);
    }),
    deleteItemAsync: jest.fn((key) => {
      return mock.removeItem(key);
    })
  };
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

jest.mock('@react-native-firebase/analytics', () => () => {
  return {
    logEvent: jest.fn(),
    logLogin: jest.fn(),
    logScreenView: jest.fn(),
    setUserId: jest.fn()
  };
});

jest.mock('expo-constants', () => {
  return {
    expoConfig: {
      extra: {
        hpapp: {
          useLocalAuth: true,
          auth: {
            google: {
              iosClientId: 'iosClientId',
              androidClientId: 'androidClientId'
            }
          }
        }
      }
    }
  };
});

jest.mock('expo-updates', () => ({
  ...jest.requireActual('expo-updates'),
  fetchUpdateAsync: jest.fn(),
  reloadAsync: jest.fn(),
  checkForUpdateAsync: jest.fn(() => {
    return {
      isAvailable: false,
      manifest: {
        id: 'test',
        commitTime: 100,
        assets: []
      },
      isRollBackToEmbedded: false,
      reason: undefined
    };
  })
}));

jest.mock('expo-crypto/build/ExpoCrypto', () => ({
  digestStringAsync: jest.fn((algorithm: string, data: string, options = { encoding: 'hex' }) => {
    const crypto = require('crypto');
    const hash = crypto.createHash(algorithm.toLowerCase().replace('-', ''));

    hash.update(data);
    return Promise.resolve(hash.digest(options.encoding ?? 'hex'));
  })
}));

// React Native Elements Mock
jest.mock('@rneui/themed', () => {
  const OriginalModule = jest.requireActual('@rneui/themed');
  const Mock = { ...OriginalModule };
  // enforce to put <Icon ... /> in snapshots
  Mock.Icon = 'Icon';
  return Mock;
});
jest.mock('react-native-vector-icons/Ionicons', () => {
  return 'Ionicons';
});
jest.mock('@expo/vector-icons/Ionicons', () => {
  return 'Ionicons';
});
jest.mock('react-native-vector-icons/Entypo', () => {
  return 'Entypo';
});
jest.mock('@expo/vector-icons/Entypo', () => {
  return 'Entypo';
});
jest.mock('react-native-vector-icons/MaterialIcons', () => {
  return 'MaterialIcons';
});
jest.mock('@expo/vector-icons/MaterialIcons', () => {
  return 'MaterialIcons';
});
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  return 'MaterialCommunityIcons';
});
jest.mock('@expo/vector-icons/MaterialCommunityIcons', () => {
  return 'MaterialCommunityIcons';
});
jest.mock('react-native-vector-icons/FontAwesome', () => {
  return 'FontAwesome';
});
jest.mock('@expo/vector-icons/FontAwesome', () => {
  return 'FontAwesome';
});

// Firebase Mock
jest.mock('@react-native-firebase/auth', () => {
  const module = () => ({
    signInWithCredential: jest.fn(() => {
      return {
        user: {
          getIdToken: jest.fn(() => Promise.resolve('testtoken'))
        }
      };
    }),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn()
  });
  module.GoogleAuthProvider = {
    credential: jest.fn()
  };
  return module;
});

jest.mock('react-native-share', () => ({
  default: jest.fn()
}));

jest.mock('expo-sqlite', () => ({
  default: jest.fn(),
  openDatabaseSync: jest.fn()
}));

jest.mock('@react-native-cookies/cookies', () => ({
  set: jest.fn(),
  get: jest.fn(),
  clearAll: jest.fn()
}));

jest.mock('@hpapp/system/media', () => {
  const OriginalModule = jest.requireActual('@hpapp/system/media');
  const Mock = {
    ...OriginalModule,
    LocalMediaManagerProvider({ name, children }: { name: string; children: React.ReactNode }) {
      return children;
    },
    useLocalMediaManager: jest.fn(() => {
      return {
        isAvailable: true,
        getAssetFromURI: jest.fn(() => {
          return Promise.resolve(null);
        }),
        saveToAsset: jest.fn(() => {
          return Promise.resolve();
        })
      };
    })
  };
  return Mock;
});

jest.mock('@hpapp/system/graphql/relay');

jest.mock('@hpapp/features/app/storybook', () => {
  return {
    __esModule: true,
    default: () => {
      return <></>;
    }
  };
});

jest.setTimeout(30000);
