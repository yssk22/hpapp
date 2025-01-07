import { Spacing } from '@hpapp/features/common/constants';
import { Button } from '@rneui/themed';
import { View, StyleSheet } from 'react-native';

import ElineupMallStatusIcon from './ElineupMallStatusIcon';

export default function ElineupMallOpenCartButton() {
  return (
    <Button
      title="Elineup!Mall"
      type="outline"
      size="sm"
      color="secondary"
      containerStyle={styles.button}
      icon={
        <View style={styles.icon}>
          <ElineupMallStatusIcon />
        </View>
      }
      onPress={() => {}}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    marginRight: Spacing.XSmall
  },
  icon: {
    marginRight: Spacing.XSmall
  }
});
