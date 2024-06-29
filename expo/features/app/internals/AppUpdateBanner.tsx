import { useThemeColor } from '@hpapp/features/app/theme';
import { Text } from '@hpapp/features/common';
import { FontSize, Spacing } from '@hpapp/features/common/constants';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import { useState, useEffect } from 'react';
import { AppState, AppStateStatus, TouchableOpacity, StyleSheet, View } from 'react-native';
import * as logging from 'system/logging';

const UPDATE_INTERVAL_MS = 60 * 1000;

type BannerAppUpdateState = {
  updateAvailable: boolean;
  isUpdating: boolean;
  lastUpdateTimestamp: Date | null;
};

export default function AppUpdateBanner({
  updateAvaiableText = 'Update is available. Tap to install.',
  updateInProgressText = 'Updating...'
}: {
  updateAvaiableText?: string;
  updateInProgressText?: string;
}) {
  const [color, contrast] = useThemeColor('warning');
  const [state, setState] = useState<BannerAppUpdateState>({
    updateAvailable: false,
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
            updateAvailable: update.isAvailable,
            lastUpdateTimestamp: new Date()
          });
        }
      } catch (e: any) {
        if (Constants.expoConfig?.extra?.hpapp?.isDev !== true) {
          logging.Error('features.app.AppUpdateBanner', 'failed to check update', {
            error: e.toString()
          });
        }
        if (!unmounted) {
          setState({
            ...state,
            updateAvailable: false,
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

  if (!state.updateAvailable) {
    return null;
  }

  const text = state.isUpdating ? updateInProgressText : updateAvaiableText;
  return (
    <TouchableOpacity
      testID="AppUpdateBanner"
      disabled={state.isUpdating}
      onPress={async () => {
        setState({
          ...state,
          isUpdating: true
        });
        try {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        } catch (e) {
          alert(e?.toString() ?? 'Unknown error occurrs');
          setState({
            ...state,
            isUpdating: false
          });
        }
      }}
    >
      <View style={[styles.container, { backgroundColor: color }]}>
        <Text style={[styles.text, { color: contrast }]}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.Small,
    marginBottom: 2
  },
  text: {
    fontSize: FontSize.Medium,
    textAlign: 'center'
  }
});
