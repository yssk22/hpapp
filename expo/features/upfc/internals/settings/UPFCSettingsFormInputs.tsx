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
  username: string;
  onChangeUsername: (s: string) => void;
  password: string;
  onChangePassword: (s: string) => void;
  calendarId: string;
  onChangeCalendarId: (s: string) => void;
  eventPrefix: string;
  onChangeEventPrefix: (s: string) => void;
};

export default function UPFCSettingsFormInputs({
  isSaving,
  lastError,
  username,
  onChangeUsername,
  password,
  onChangePassword,
  calendarId,
  onChangeCalendarId,
  eventPrefix,
  onChangeEventPrefix
}: UPFCSettingsFormInputsProps) {
  const [errorColor] = useThemeColor('error');
  return (
    <>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{t('FC Member Number')}</Text>
        <Input
          disabled={isSaving}
          keyboardType="numeric"
          containerStyle={styles.input}
          errorStyle={styles.inputError}
          placeholder={t('FC Member Number')}
          value={username}
          onChangeText={onChangeUsername}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{t('FC Password')}</Text>
        <Input
          disabled={isSaving}
          keyboardType="ascii-capable"
          textContentType="password"
          secureTextEntry
          containerStyle={styles.input}
          errorStyle={styles.inputError}
          placeholder={t('FC Password')}
          value={password}
          onChangeText={onChangePassword}
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