import * as logging from '@hpapp/system/logging';
import { useCallback, useEffect, useMemo, useState } from 'react';

import SettingsAppConfig, { AppConfig, SettingsAppConfigDefault } from './internals/SettingsAppConfig';
import SettingsCurrentUser, { CurrentUser } from './internals/SettingsCurrentUser';
import SettingsList from './internals/SettingsList';
import Provider, { useSettings } from './internals/SettingsProvider';
import SettingsUPFCConfig, { UPFCConfig } from './internals/SettingsUPFCConfig';
import SettingsUserConfig, { UserConfig } from './internals/SettingsUserConfig';

export type SettingsProviderProps = {
  appConfig?: AppConfig;
  userConfig?: UserConfig;
  currentUser?: CurrentUser;
  upfcConfig?: UPFCConfig;
};

/**
 * A provider to setup the settings context
 */
export function SettingsProvider({
  appConfig,
  userConfig,
  currentUser,
  upfcConfig,
  children
}: SettingsProviderProps & {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    (async () => {
      currentUser && (await SettingsCurrentUser.save(currentUser));
      userConfig && (await SettingsUserConfig.save(userConfig));
      appConfig && (await SettingsAppConfig.save(appConfig));
      upfcConfig && (await SettingsUPFCConfig.save(upfcConfig));
      setReady(true);
    })();
  }, []);
  if (!ready) {
    return null;
  }
  return <Provider settings={SettingsList}>{children}</Provider>;
}

/**
 * Get the application configuration
 */
export function useAppConfig() {
  const [appConfig] = useSettings(SettingsAppConfig);
  return useMemo(() => {
    return {
      ...SettingsAppConfigDefault,
      ...appConfig
    };
  }, [appConfig]);
}

export { SettingsAppConfigDefault };

/**
 * Get the updator for AppConfig
 */
export function useAppConfigUpdator() {
  const [, updator] = useSettings(SettingsAppConfig);
  return updator;
}

/**
 * Get the user configuration
 */
export function useUserConfig() {
  const [userConfig] = useSettings(SettingsUserConfig);
  return userConfig;
}

/**
 * Get the updator for user configuration
 */
export function useUserConfigUpdator() {
  const [, updator] = useSettings(SettingsUserConfig);
  return updator;
}

/**
 * Get the UPFC configuration
 */
export function useUPFCConfig() {
  const [upfcConfig] = useSettings(SettingsUPFCConfig);
  return upfcConfig;
}

/**
 * Get the updator for UPFC configuration
 */
export function useUPFCConfigUpdator() {
  const [, updator] = useSettings(SettingsUPFCConfig);
  return updator;
}

/**
 * Get the current user
 */
export function useCurrentUser() {
  const [currentUser] = useSettings(SettingsCurrentUser);
  return currentUser;
}

export type User = NonNullable<ReturnType<typeof useCurrentUser>>;

/**
 * Get the updator for current user
 */
export function useCurrentUserUpdator() {
  const [currentUser, updator] = useSettings(SettingsCurrentUser);
  return useCallback(
    (update: CurrentUser | null) => {
      if (currentUser) {
        if (update == null) {
          logging.Info('features.auth.logout', 'logout', {
            userid: currentUser.id
          });
        }
      } else {
        if (update) {
          logging.Info('features.auth.login', 'login', {
            userid: update.id
          });
        }
      }
      return updator(update);
    },
    [updator]
  );
}