import useAppConfig from '@hpapp/features/appconfig/useAppConfig';
import { Spacing } from '@hpapp/features/common/constants';
import { useColor } from '@hpapp/features/settings/context/theme';
import UPFCDemoScraper from '@hpapp/features/upfc/internals/scraper/UPFCDemoScraper';
import UPFCHttpFetcher from '@hpapp/features/upfc/internals/scraper/UPFCHttpFetcher';
import UPFCSiteScraper from '@hpapp/features/upfc/internals/scraper/UPFCSiteScraper';
import { ErrUPFCAuthentication } from '@hpapp/features/upfc/internals/scraper/errors';
import UPFCSettingsFormInputs from '@hpapp/features/upfc/internals/settings/UPFCSettingsFormInputs';
import useUPFCSettings from '@hpapp/features/upfc/internals/settings/useUPFCSettings';
import { t } from '@hpapp/system/i18n';
import { Button } from '@rneui/themed';
import { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Toast from 'react-native-root-toast';

type UPFCSettingsFormProps = {
  onSave?: () => void;
};

export default function UPFCSettingsForm({ onSave }: UPFCSettingsFormProps) {
  //   const upfc = useHomeUPFCModel();
  const appConfig = useAppConfig();
  const [successColor, succsesContrast] = useColor('success');
  const [isSaving, setIsSaving] = useState(false);
  const [lastError, setLastError] = useState<Error | null>(null);
  const [config, setConfig] = useUPFCSettings();
  const [username, setUsername] = useState(config?.username ?? '');
  const [password, setPassword] = useState(config?.password ?? '');
  const [calendarId, setCalendarId] = useState(config?.calendarId ?? '');
  const [eventPrefix, setEventPrefix] = useState(config?.eventPrefix ?? '');
  const handleOnClear = useCallback(async () => {
    setUsername('');
    setPassword('');
    setCalendarId('');
    setEventPrefix('');
    setConfig(null);
    setLastError(null);
    // clear the cache
    // await upfc.clearCache();
    // await upfc.reload();
  }, [setConfig, setUsername, setPassword, setCalendarId, setEventPrefix]);
  const handleOnSave = useCallback(() => {
    setLastError(null);
    setIsSaving(true);
    (async () => {
      try {
        const scraper = appConfig.useUPFCDemoScraper
          ? new UPFCDemoScraper()
          : new UPFCSiteScraper(new UPFCHttpFetcher());
        const ok = await scraper.authenticate(username, password);
        if (!ok) {
          throw new ErrUPFCAuthentication();
        }
        Toast.show(t('Saved Successfully!'), {
          position: Toast.positions.BOTTOM,
          duration: Toast.durations.SHORT,
          textColor: succsesContrast,
          backgroundColor: successColor
        });
        setConfig({
          username,
          password,
          calendarId,
          eventPrefix
        });
        // upfc.reload();
      } catch (e) {
        setLastError(e as Error);
        return;
      } finally {
        setIsSaving(false);
      }
      onSave && onSave();
    })();
  }, [setConfig, username, password, calendarId, eventPrefix]);
  return (
    <View style={styles.container}>
      <UPFCSettingsFormInputs
        isSaving={isSaving}
        lastError={lastError}
        username={username}
        onChangeUsername={setUsername}
        password={password}
        onChangePassword={setPassword}
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
    </View>
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
