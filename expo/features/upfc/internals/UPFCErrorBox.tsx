import { Text } from '@hpapp/features/common';
import { useNavigation } from '@hpapp/features/common/stack';
import UPFCSettingsScreen from '@hpapp/features/upfc/UPFCSettingsScreen';
import { ErrUPFCAuthentication, ErrUPFCNoCredential } from '@hpapp/features/upfc/scraper';
import { t } from '@hpapp/system/i18n';
import { Button } from '@rneui/themed';
import { View, StyleSheet } from 'react-native';

export default function UPFCErrorBox({ error }: { error: Error }) {
  const navigation = useNavigation();
  if (error instanceof ErrUPFCAuthentication || error instanceof ErrUPFCNoCredential) {
    return (
      <View style={styles.container}>
        <Button
          color="secondary"
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
