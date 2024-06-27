import Text from '@hpapp/features/common/components/Text';
import { useNavigation } from '@hpapp/features/root/internals/protected/stack';
import UPFCSettingsScreen from '@hpapp/features/upfc/components/UPFCSettingsScreen';
import { ErrUPFCAuthentication, ErrUPFCNoCredential } from '@hpapp/features/upfc/internals/scraper/errors';
import { t } from '@hpapp/system/i18n';
import { Button } from '@rneui/themed';
import { View, StyleSheet } from 'react-native';

export default function UPFCErrorBox({ error }: { error: Error }) {
  const navigation = useNavigation();
  if (error instanceof ErrUPFCAuthentication || error instanceof ErrUPFCNoCredential) {
    return (
      <View style={styles.container}>
        <Button
          testID="UPFCErrorBox.ConfigureButton"
          onPress={() => {
            navigation.push(UPFCSettingsScreen);
          }}
          title={t('Configure fan club settings')}
        />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text>something went wrong</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
