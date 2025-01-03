import { useThemeColor } from '@hpapp/features/app/theme';
import { Text } from '@hpapp/features/common';
import { FontSize, Spacing } from '@hpapp/features/common/constants';
import { t } from '@hpapp/system/i18n';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import { useState, useEffect, useCallback } from 'react';
import { AppState, AppStateStatus, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as logging from 'system/logging';

const UPDATE_INTERVAL_MS = 60 * 1000;

type BannerAppUpdateState = {
  bannerText: string | null;
  debugText: string | null;
  isUpdating: boolean;
  lastUpdateTimestamp: Date | null;
};

export default function AppUpdateBanner() {
  const insets = useSafeAreaInsets();
  const [color, contrast] = useThemeColor('warning');
  const [state, setState] = useState<BannerAppUpdateState>({
    bannerText: null,
    debugText: null,
    isUpdating: false,
    lastUpdateTimestamp: null
  });
  useEffect(() => {
    let unmounted = false;
    const checkUpdateState = async () => {
      if (state.isUpdating) {
        return;
      }
      if (state.lastUpdateTimestamp !== null) {
        const now = new Date();
        const diff = now.getTime() - state.lastUpdateTimestamp.getTime();
        if (diff < UPDATE_INTERVAL_MS) {
          return;
        }
      }
      try {
        const update = await Updates.checkForUpdateAsync();
        if (!unmounted) {
          setState({
            ...state,
            debugText: JSON.stringify(update),
            bannerText: update.isAvailable ? t('Update is available - Tap to install.') : null,
            lastUpdateTimestamp: new Date()
          });
        }
      } catch (e: any) {
        if (Constants.expoConfig?.extra?.hpapp?.isDev !== true) {
          logging.Error('features.app.AppUpdateBanner', 'failed to aa check update', {
            error: e.toString()
          });
        }
        if (!unmounted) {
          setState({
            ...state,
            bannerText: `failed to check update`,
            debugText: e.toString(),
            lastUpdateTimestamp: new Date()
          });
        }
      }
    };
    const s = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        checkUpdateState();
      }
    });
    checkUpdateState();
    return () => {
      s.remove();
      unmounted = true;
    };
  });
  const updateApp = useCallback(async () => {
    setState({
      ...state,
      bannerText: `${t('Updating')}...`,
      isUpdating: true
    });
    try {
      const result = await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
      setState({
        ...state,
        bannerText: null,
        debugText: JSON.stringify(result),
        isUpdating: false
      });
    } catch (e: any) {
      setState({
        ...state,
        bannerText: `Failed to update: ${e.toString()}`,
        debugText: e.toString(),
        isUpdating: false
      });
    }
  }, []);
  if (state.bannerText === null) {
    return null;
  }
  return (
    <TouchableOpacity
      testID="AppUpdateBanner"
      style={[
        styles.container,
        { backgroundColor: color, paddingTop: insets.top + Spacing.XSmall, paddingBottom: Spacing.XSmall }
      ]}
      onPress={updateApp}
    >
      <Text style={[styles.text, { color: contrast }]}>{state.bannerText}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.Small
  },
  text: {
    fontSize: FontSize.Medium,
    textAlign: 'center'
  }
});
