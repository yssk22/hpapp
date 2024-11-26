import { useAppConfig, useAppConfigUpdator } from '@hpapp/features/app/settings';
// import { Text } from '@hpapp/features/common';
import { FontSize, Spacing } from '@hpapp/features/common/constants';
import { Button, Dialog, Input, Switch } from '@rneui/themed';
import { useState } from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';

const deviceHeight = Dimensions.get('window').height;

type AppConfigModalProps = { isVisible: boolean; onClose: () => void };

/**
 * AppConfigModal shows a modal to configure the application settings.
 *
 * @param {boolean} visible - Indicates whether the modal is visible.
 * @param {() => void} onClose - Callback function to close the modal.
 */
export default function AppConfigModal({ isVisible, onClose }: AppConfigModalProps) {
  const appConfig = useAppConfig();
  const appConfigUpdate = useAppConfigUpdator();
  const [useStorybook, setUseStorybook] = useState(appConfig.useStorybook ?? false);
  const [useCustomGraphQLEndpoint, setUseCustomGraphQLEndpoint] = useState(appConfig.useCustomGraphQLEndpoint ?? false);
  const [graphQLEndpoint, setGraphQLEndpoint] = useState(appConfig.graphQLEndpoint ?? '');
  const [useLocalAuth, setUseLocalAuth] = useState(appConfig.useLocalAuth ?? false);
  const [useUPFCDemoScraper, setUseUPFCDemoScraper] = useState(appConfig.useUPFCDemoScraper ?? false);
  const onSave = () => {
    appConfigUpdate({
      useStorybook,
      useCustomGraphQLEndpoint,
      graphQLEndpoint,
      useLocalAuth,
      useUPFCDemoScraper
    });
    onClose();
  };
  return (
    <Dialog isVisible={isVisible} overlayStyle={styles.dialog}>
      <Dialog.Title>App Configuration</Dialog.Title>
      <View style={styles.content} testID="AppConfigModal.content">
        <View style={styles.form}>
          <View style={[styles.inputGroup, styles.switchContainer]}>
            <Text style={styles.label}>Use Storybook</Text>
            <Switch
              value={useStorybook}
              onValueChange={() => {
                setUseStorybook(!useStorybook);
              }}
            />
          </View>
          <View style={[styles.inputGroup, styles.switchContainer]}>
            <Text style={styles.label}>Use Local Auth</Text>
            <Switch
              value={useLocalAuth}
              onValueChange={() => {
                setUseLocalAuth(!useLocalAuth);
              }}
            />
          </View>
          <View style={[styles.inputGroup, styles.switchContainer]}>
            <Text style={styles.label}>Use Custom GraphQL Endpoint</Text>
            <Switch
              value={useCustomGraphQLEndpoint}
              onValueChange={() => {
                setUseCustomGraphQLEndpoint(!useCustomGraphQLEndpoint);
              }}
            />
          </View>
          <View style={!styles.inputGroup}>
            <Text style={styles.label}>GraphQL Endpoint</Text>
            <Input
              keyboardType="url"
              containerStyle={styles.input}
              errorStyle={styles.inputError}
              placeholder="http://localhost:8080/graphql/v3"
              value={graphQLEndpoint}
              onChangeText={(text) => {
                setGraphQLEndpoint(text);
              }}
              testID="AppConfigModal.graphQLEndpoint"
            />
          </View>
          <View style={[styles.inputGroup, styles.switchContainer]}>
            <Text style={styles.label}>Use UPFC Demo Scraper</Text>
            <Switch
              value={useUPFCDemoScraper}
              onValueChange={() => {
                setUseUPFCDemoScraper(!useUPFCDemoScraper);
              }}
            />
          </View>
        </View>
        <View style={styles.buttonGroup}>
          <Button type="outline" style={styles.button} onPress={onClose} testID="AppConfigModal.btnClose">
            Cancel
          </Button>
          <Button type="solid" style={styles.button} onPress={onSave} testID="AppConfigModal.btnSave">
            Save
          </Button>
        </View>
      </View>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  dialog: {
    height: deviceHeight - deviceHeight * 0.15,
    width: '90%'
  },
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
