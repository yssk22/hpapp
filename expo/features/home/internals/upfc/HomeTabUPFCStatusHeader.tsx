import { useThemeColor } from '@hpapp/features/app/theme';
import { IconSize, Spacing } from '@hpapp/features/common/constants';
import { useNavigation } from '@hpapp/features/common/stack';
import { useUPFCEventApplications, useUPFCWebView } from '@hpapp/features/upfc';
import UPFCSettingsScreen from '@hpapp/features/upfc/UPFCSettingsScreen';
import { ErrUPFCNoCredential } from '@hpapp/features/upfc/scraper';
import { Button, Icon } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';

export type HomeTabUPFCStatusHeaderPros = {
  upfc: ReturnType<typeof useUPFCEventApplications>;
};

export default function HomeTabUPFCStatusHeader({ upfc }: HomeTabUPFCStatusHeaderPros) {
  const openUPFC = useUPFCWebView();
  const navigation = useNavigation();
  const [successColor] = useThemeColor('success');
  const [errorColor] = useThemeColor('error');
  const [disabledColor] = useThemeColor('disabled');
  const succsesIcon = (
    <Icon
      containerStyle={styles.authStatusIcon}
      color={successColor}
      name="check-circle"
      type="fontawesome"
      size={IconSize.Small}
    />
  );
  const errorIcon = (
    <Icon
      containerStyle={styles.authStatusIcon}
      color={errorColor}
      name="error"
      type="material-icons"
      size={IconSize.Small}
    />
  );
  const disabledIcon = (
    <Icon
      containerStyle={styles.authStatusIcon}
      color={disabledColor}
      name="settings"
      type="ionicons"
      size={IconSize.Small}
    />
  );

  return (
    <View style={styles.authStatus}>
      <Button
        title="Hello! Project"
        type="outline"
        size="sm"
        color="secondary"
        containerStyle={styles.authStatusButton}
        icon={
          upfc.data?.hpError === undefined
            ? succsesIcon
            : upfc.data?.hpError instanceof ErrUPFCNoCredential
              ? disabledIcon
              : errorIcon
        }
        onPress={() => {
          if (upfc.data?.hpError instanceof ErrUPFCNoCredential) {
            navigation.push(UPFCSettingsScreen);
          } else {
            openUPFC({
              site: 'helloproject'
            });
          }
        }}
      />
      <Button
        title="M-Line"
        type="outline"
        size="sm"
        color="success"
        containerStyle={styles.authStatusButton}
        icon={
          upfc.data?.mlError === undefined
            ? succsesIcon
            : upfc.data?.mlError instanceof ErrUPFCNoCredential
              ? disabledIcon
              : errorIcon
        }
        onPress={() => {
          if (upfc.data?.mlError instanceof ErrUPFCNoCredential) {
            navigation.push(UPFCSettingsScreen);
          } else {
            openUPFC({
              site: 'm-line'
            });
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  authStatus: {
    flexDirection: 'row',
    padding: Spacing.XXSmall,
    justifyContent: 'flex-end'
  },
  authStatusButton: {
    marginRight: Spacing.XSmall
  },
  authStatusIcon: {
    marginRight: Spacing.XXSmall
  }
});
