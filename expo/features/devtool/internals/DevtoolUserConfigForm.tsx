import { useUserConfig, useUserConfigUpdator } from '@hpapp/features/app/settings';
import { Text } from '@hpapp/features/common';
import { FontSize, Spacing } from '@hpapp/features/common/constants';
import { Switch } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';

export default function DevtoolUserConfigForm() {
  const userConfig = useUserConfig()!;
  const userConfigUpdate = useUserConfigUpdator();

  return (
    <>
      <View style={[styles.inputGroup, styles.switchContainer]}>
        <Text style={styles.label}>completeOnboarding</Text>
        <Switch
          value={userConfig.completeOnboarding}
          onValueChange={() => {
            userConfigUpdate({ ...userConfig, completeOnboarding: !userConfig.completeOnboarding });
          }}
        />
      </View>
      <View style={[styles.inputGroup, styles.switchContainer]}>
        <Text style={styles.label}>consentOnToS</Text>
        <Switch
          value={userConfig.consentOnToS}
          onValueChange={() => {
            userConfigUpdate({ ...userConfig, consentOnToS: !userConfig.consentOnToS });
          }}
        />
      </View>
      <View style={[styles.inputGroup, styles.switchContainer]}>
        <Text style={styles.label}>consentOnPrivacy</Text>
        <Switch
          value={userConfig.consentOnPrivacy}
          onValueChange={() => {
            userConfigUpdate({ ...userConfig, consentOnPrivacy: !userConfig.consentOnPrivacy });
          }}
        />
      </View>
      <View style={[styles.inputGroup, styles.switchContainer]}>
        <Text style={styles.label}>consentOnUPFCDataPolicy</Text>
        <Switch
          value={userConfig.consentOnUPFCDataPolicy}
          onValueChange={() => {
            userConfigUpdate({ ...userConfig, consentOnUPFCDataPolicy: !userConfig.consentOnUPFCDataPolicy });
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'column'
  },
  form: {
    flex: 1,
    flexGrow: 1
  },
  label: {
    paddingLeft: Spacing.Small,
    paddingRight: Spacing.Small
  },
  default: {
    fontStyle: 'italic',
    fontSize: FontSize.XSmall
  },
  inputGroup: {
    marginTop: Spacing.XSmall
  },
  switchContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.Small
  },
  input: {},
  inputError: {},
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
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
