import Text from '@hpapp/features/common/components/Text';
import { FontSize, Spacing } from '@hpapp/features/common/constants';
import { useColor } from '@hpapp/features/settings/context/theme';
import * as Updates from 'expo-updates';
import { useState, useEffect } from 'react';
import { AppState, AppStateStatus, TouchableOpacity, StyleSheet, View } from 'react-native';
import * as logging from 'system/logging';

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

const UPDATE_INTERVAL_MS = 60 * 1000;

export default function AppUpdateBanner({
  updateAvaiableText = 'Update is available. Tap to install.',
  updateInProgressText = 'Updating...'
}: {
  updateAvaiableText?: string;
  updateInProgressText?: string;
}) {
  const [updateCheckState, setUpdateCheckState] = useState<Date | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updatingState, setUpdatingState] = useState(false);
  useEffect(() => {
    let unmounted = false;
    const checkUpdateState = async () => {
      if (updateCheckState) {
        const now = new Date();
        const diff = now.getTime() - updateCheckState.getTime();
        if (diff < UPDATE_INTERVAL_MS) {
          return;
        }
      }
      try {
        const update = await Updates.checkForUpdateAsync();
        if (!unmounted) {
          setUpdateCheckState(new Date());
          setUpdateAvailable(update.isAvailable);
        }
      } catch (e: any) {
        logging.Error('features.root.banner.AppUpdateBanner', 'failed to check update', {
          error: e.toString()
        });
        if (!unmounted) {
          setUpdateCheckState(null);
          setUpdateAvailable(false);
        }
      }
    };
    const stateChangeListener = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        checkUpdateState();
      }
    };
    const s = AppState.addEventListener('change', stateChangeListener);
    checkUpdateState();
    return () => {
      s.remove();
      unmounted = true;
    };
  });

  const [color, contrast] = useColor('warning');

  if (!updateAvailable) {
    return null;
  }

  const text = updatingState ? updateInProgressText : updateAvaiableText;
  const disabled = updatingState;
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={async () => {
        setUpdatingState(true);
        try {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        } catch (e) {
          alert(e?.toString() ?? 'Unknown error occurrs');
          setUpdatingState(false);
        }
      }}
    >
      <View style={[styles.container, { backgroundColor: color }]}>
        <Text style={[styles.text, { color: contrast }]}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}
