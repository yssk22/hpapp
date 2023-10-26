import appcheck from '@react-native-firebase/app-check';
import { useEffect, useState } from 'react';

const provider = appcheck().newReactNativeFirebaseAppCheckProvider();
provider.configure({
  apple: {
    provider: 'deviceCheck'
  }
});

appcheck().initializeAppCheck({
  provider,
  isTokenAutoRefreshEnabled: true
});

function useAppCheckToken() {
  const [token, setToken] = useState({
    value: '',
    timestamp: new Date()
  });
  useEffect(() => {
    if (token.value === '') {
      (async () => {
        const t = await appcheck().getToken();
        setToken({
          value: t.token,
          timestamp: new Date()
        });
      })();
    }
  }, []);
  return token;
}

async function getToken() {
  return await appcheck().getToken();
}

export { useAppCheckToken, getToken };
