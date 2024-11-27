import { useAppConfig, useUPFCConfigUpdator, useUPFCConfig } from '@hpapp/features/app/settings';
import { useThemeColor } from '@hpapp/features/app/theme';
import { Spacing } from '@hpapp/features/common/constants';
import {
  UPFCDemoScraper,
  ErrUPFCAuthentication,
  UPFC2SiteScraper,
  UPFC2HttpFetcher
} from '@hpapp/features/upfc/scraper';
import { t } from '@hpapp/system/i18n';
import { Button } from '@rneui/themed';
import { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-root-toast';

import UPFCSettingsFormInputs from './UPFCSettingsFormInputs';

type UPFCSettingsFormProps = {
  onSave?: () => void;
};

export default function UPFCSettingsForm({ onSave }: UPFCSettingsFormProps) {
  const appConfig = useAppConfig();
  const [successColor, succsesContrast] = useThemeColor('success');
  const [isSaving, setIsSaving] = useState(false);
  const [lastError, setLastError] = useState<Error | null>(null);
  const upfcConfig = useUPFCConfig();
  const updateConfig = useUPFCConfigUpdator();

  const [hpUsername, setHPUsername] = useState(upfcConfig?.hpUsername ?? '');
  const [hpPassword, setHPPassword] = useState(upfcConfig?.hpPassword ?? '');
  const [mlUsername, setMLUsername] = useState(upfcConfig?.mlUsername ?? '');
  const [mlPassword, setMLPassword] = useState(upfcConfig?.mlPassword ?? '');

  const [calendarId, setCalendarId] = useState(upfcConfig?.calendarId ?? '');
  const [eventPrefix, setEventPrefix] = useState(upfcConfig?.eventPrefix ?? '');
  const handleOnClear = useCallback(async () => {
    setHPUsername('');
    setHPPassword('');
    setMLUsername('');
    setMLPassword('');
    setCalendarId('');
    setEventPrefix('');
    updateConfig(null);
    setLastError(null);
    // clear the cache
    // await upfc.clearCache();
    // await upfc.reload();
  }, [updateConfig, setHPUsername, setHPPassword, setMLUsername, setMLPassword, setCalendarId, setEventPrefix]);
  const handleOnSave = useCallback(() => {
    setLastError(null);
    setIsSaving(true);
    (async () => {
      try {
        let lastAuthenticatedAt = null;
        const scraper = appConfig.useUPFCDemoScraper
          ? new UPFCDemoScraper()
          : new UPFC2SiteScraper(new UPFC2HttpFetcher());

        if (hpUsername !== '' && hpUsername !== UPFCDemoScraper.Username) {
          const ok = await scraper.authenticate(hpUsername, hpPassword, 'helloproject');
          if (!ok) {
            throw new ErrUPFCAuthentication();
          }
          lastAuthenticatedAt = new Date().getTime() / 1000;
        }
        if (mlUsername !== '' && mlUsername !== UPFCDemoScraper.Username) {
          const ok = await scraper.authenticate(mlUsername, mlPassword, 'm-line');
          if (!ok) {
            throw new ErrUPFCAuthentication();
          }
          lastAuthenticatedAt = new Date().getTime() / 1000;
        }
        Toast.show(t('Saved Successfully!'), {
          position: Toast.positions.BOTTOM,
          duration: Toast.durations.SHORT,
          textColor: succsesContrast,
          backgroundColor: successColor
        });
        updateConfig({
          hpUsername,
          hpPassword,
          mlUsername,
          mlPassword,
          calendarId,
          eventPrefix,
          lastAuthenticatedAt
        });
      } catch (e) {
        setLastError(e as Error);
        return;
      } finally {
        setIsSaving(false);
      }
      onSave && onSave();
    })();
  }, [updateConfig, hpUsername, hpPassword, mlUsername, mlPassword, calendarId, eventPrefix]);
  return (
    <KeyboardAwareScrollView style={styles.container}>
      <UPFCSettingsFormInputs
        isSaving={isSaving}
        lastError={lastError}
        hpUsername={hpUsername}
        onChangeHPUsername={setHPUsername}
        hpPassword={hpPassword}
        onChangeHPPassword={setHPPassword}
        mlUsername={mlUsername}
        onChangeMLUsername={setMLUsername}
        mlPassword={mlPassword}
        onChangeMLPassword={setMLPassword}
        calendarId={calendarId}
        onChangeCalendarId={setCalendarId}
        eventPrefix={eventPrefix}
        onChangeEventPrefix={setEventPrefix}
      />
      <View style={styles.buttonGroup}>
        <Button containerStyle={styles.button} type="outline" onPress={handleOnClear}>
          {t('Clear')}
        </Button>
        <Button containerStyle={styles.button} onPress={handleOnSave} loading={isSaving}>
          {t('Save')}
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: Spacing.Small,
    paddingRight: Spacing.Small
  },
  inputGroup: {
    marginTop: Spacing.XSmall
  },
  label: {
    paddingLeft: Spacing.Small,
    paddingRight: Spacing.Small
  },
  input: {},
  calendar: {
    marginLeft: Spacing.XXSmall
  },
  inputError: {
    height: 0 // no need to show
  },
  errorMessage: {
    paddingLeft: Spacing.Small,
    fontStyle: 'italic'
  },
  buttonGroup: {
    marginTop: Spacing.Small,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  button: {
    flexGrow: 1,
    paddingLeft: Spacing.Small,
    paddingRight: Spacing.Small
  }
});
