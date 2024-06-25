import { useNavigation } from '@hpapp/features/root/protected/stack';
import UPFCSettingsScreen from '@hpapp/features/upfc/settings/UPFCSettingsScreen';
import { t } from '@hpapp/system/i18n';
import { Button } from '@rneui/themed';
import { View, StyleSheet } from 'react-native';

export default function UPFCNoCredentials() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Button
        onPress={() => {
          navigation.push(UPFCSettingsScreen);
        }}
        title={t('Configure fan club settings')}
      />
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
