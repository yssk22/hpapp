import { useThemeColor } from '@hpapp/features/app/theme';
import { Text } from '@hpapp/features/common';
import { Spacing } from '@hpapp/features/common/constants';
import { CalendarDropdown } from '@hpapp/features/common/form';
import { ErrUPFCAuthentication } from '@hpapp/features/upfc/scraper';
import { t } from '@hpapp/system/i18n';
import { Input } from '@rneui/themed';
import { View, StyleSheet } from 'react-native';

export type UPFCSettingsFormInputsProps = {
  isSaving: boolean;
  lastError: unknown | null;

  hpUsername: string;
  onChangeHPUsername: (s: string) => void;
  hpPassword: string;
  onChangeHPPassword: (s: string) => void;

  mlUsername: string;
  onChangeMLUsername: (s: string) => void;
  mlPassword: string;
  onChangeMLPassword: (s: string) => void;

  calendarId: string;
  onChangeCalendarId: (s: string) => void;
  eventPrefix: string;
  onChangeEventPrefix: (s: string) => void;
};

export default function UPFCSettingsFormInputs({
  isSaving,
  lastError,
  hpUsername,
  onChangeHPUsername,
  hpPassword,
  onChangeHPPassword,
  mlUsername,
  onChangeMLUsername,
  mlPassword,
  onChangeMLPassword,
  calendarId,
  onChangeCalendarId,
  eventPrefix,
  onChangeEventPrefix
}: UPFCSettingsFormInputsProps) {
  const [errorColor] = useThemeColor('error');
  return (
    <>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{t('FC Member Number (Hello ! Project)')}</Text>
        <Input
          disabled={isSaving}
          keyboardType="numeric"
          containerStyle={styles.input}
          errorStyle={styles.inputError}
          placeholder={t('FC Member Number (Hello ! Project)')}
          value={hpUsername}
          onChangeText={onChangeHPUsername}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{t('FC Password (Hello ! Project)')}</Text>
        <Input
          disabled={isSaving}
          keyboardType="ascii-capable"
          textContentType="password"
          secureTextEntry
          containerStyle={styles.input}
          errorStyle={styles.inputError}
          placeholder={t('FC Member Number (Hello ! Project)')}
          value={hpPassword}
          onChangeText={onChangeHPPassword}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{t('FC Member Number (M-line)')}</Text>
        <Input
          disabled={isSaving}
          keyboardType="numeric"
          containerStyle={styles.input}
          errorStyle={styles.inputError}
          placeholder={t('FC Member Number (M-line)')}
          value={mlUsername}
          onChangeText={onChangeMLUsername}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{t('FC Password (M-line)')}</Text>
        <Input
          disabled={isSaving}
          keyboardType="ascii-capable"
          textContentType="password"
          secureTextEntry
          containerStyle={styles.input}
          errorStyle={styles.inputError}
          placeholder={t('FC Password (M-line)')}
          value={mlPassword}
          onChangeText={onChangeMLPassword}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>{t('Sync Events to Calendar')}</Text>
        <CalendarDropdown
          selectedValue={calendarId ? calendarId : undefined}
          onSelect={(calender) => {
            onChangeCalendarId(calender?.id ?? '');
          }}
          renderIfPermissionDenied={<Text>{t('Calendar access is rejected. Open Settings to allow access.')}</Text>}
          nullText={t('Do not sync')}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{t('Event Prefix')}</Text>
        <Input
          disabled={isSaving}
          containerStyle={styles.input}
          errorStyle={styles.inputError}
          placeholder={t('Event Prefix')}
          value={eventPrefix}
          onChangeText={onChangeEventPrefix}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={[styles.errorMessage, { color: errorColor }]}>{getErrorMessage(lastError)}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    marginTop: Spacing.XSmall
  },
  label: {
    paddingLeft: Spacing.Small,
    paddingRight: Spacing.Small
  },
  input: {},
  inputError: {
    height: 0 // no need to show
  },
  errorMessage: {
    paddingLeft: Spacing.Small,
    fontStyle: 'italic'
  }
});

const getErrorMessage = (e: unknown) => {
  if (e === null) {
    return '';
  }
  if (e instanceof ErrUPFCAuthentication) {
    return t('authenticatoin failed.');
  }
  return t('something went wrong.');
};
