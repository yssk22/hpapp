import { useAppConfig, useCurrentUser } from '@hpapp/features/app/settings';
import { getAppCheckToken, getIdToken } from '@hpapp/system/firebase';
import { createEnvironment } from '@hpapp/system/graphql/relay';
import { RequestTokenSet } from '@hpapp/system/graphql/types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { RelayEnvironmentProvider } from 'react-relay';

export default function AppRelayProvider({ children }: { children: React.ReactNode }) {
  const user = useCurrentUser();
  const appConfig = useAppConfig();
  const environment = useMemo(() => {
    const httpConfig = {
      Endpoint: `${process.env.EXPO_PUBLIC_GRAPHQL_ENDPOINT}/graphql/v3`,
      NetworkTimeoutSecond: 60
    };
    const env = createEnvironment(httpConfig, async () => {
      const token: RequestTokenSet = {
        userToken: user?.accessToken
      };
      if (Platform.OS !== 'web' && !appConfig.useLocalAuth) {
        token.clientToken = (await getAppCheckToken()).token;
        token.idToken = await getIdToken();
      }
      return token;
    });
    env.configName = `${httpConfig.Endpoint}-${new Date().getTime()}`;
    return env;
  }, [user?.accessToken]);
  // NOTE:
  // RelayEnvironmentProvider SOMEHOW does not rerender even environment is updated
  // so we explicitly update key to force rerender.
  // The increment of the key happens only when environment is updated.
  const isFirstRender = useRef(true);
  const [key, setKey] = useState(0);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setKey((prevKey) => prevKey + 1);
  }, [environment]);

  return (
    <RelayEnvironmentProvider key={key} environment={environment}>
      {children}
    </RelayEnvironmentProvider>
  );
}
