import { useSettings } from '@hpapp/contexts/settings';
import { useColor } from '@hpapp/contexts/settings/theme';
import { Spacing } from '@hpapp/features/common/constants';
import { DemoScraper, useScraper } from '@hpapp/features/upfc/scraper';
import { UPFCSettings } from '@hpapp/features/upfc/settings/UPFCSettings';
import UPFCSettingsFormInputs from '@hpapp/features/upfc/settings/UPFCSettingsFormInputs';
import { t } from '@hpapp/system/i18n';
import { Button } from '@rneui/themed';
import { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Toast from 'react-native-root-toast';
// import { useHomeUPFCModel } from "src/models/upfc/HomeUPFCProvider";

// const getErrorMessage = (e: unknown) => {
//   if (e === null) {
//     return '';
//   }
//   if (e === ErrAuthentication) {
//     return t('ErrAuthentication');
//   }
//   return t('SomethingWrongWithUPFC');
// };

export default function UPFCSettingsForm() {
  //   const upfc = useHomeUPFCModel();
  const [successColor, succsesContrast] = useColor('success');
  const scraper = useScraper(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastError, setLastError] = useState<unknown | null>(null);
  const [config, setConfig] = useSettings(UPFCSettings);
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
    // clear the cache
    // await upfc.clearCache();
    // await upfc.reload();
  }, [setConfig, setUsername, setPassword, setCalendarId, setEventPrefix]);
  const handleOnSave = useCallback(() => {
    setLastError(null);
    setIsSaving(true);
    (async () => {
      try {
        if (username !== '' && password !== '') {
          if (username !== DemoScraper.Username) {
            await scraper.authenticate(username, password);
          }
        }
        Toast.show(t('Saved successfully'), {
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
        setLastError(e);
      }
      setIsSaving(false);
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
