import { useNavigation } from '@hpapp/features/common/stack';
import ElineupMallSettingsScreen from '@hpapp/features/elineupmall/ElineupMallSettingsScreen';
import { t } from '@hpapp/system/i18n';
import { Button } from '@rneui/themed';
import { View, StyleSheet } from 'react-native';

export default function ElineupMallNoFollowingsBox() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Button
        color="secondary"
        testID="ElineupMallNoFollowingsBox.ConfigureButton"
        onPress={() => {
          navigation.push(ElineupMallSettingsScreen);
        }}
        title={t('Elineup Mall Settings')}
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
