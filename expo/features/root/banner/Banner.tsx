import Text from '@hpapp/features/common/components/Text';
import { FontSize, Spacing } from '@hpapp/features/common/constants';
import { ColorScheme, useColor } from '@hpapp/features/settings/context/theme';
import { TouchableOpacity, StyleSheet, View } from 'react-native';

export default function Banner({ onPress, color, text }: { onPress: () => void; color: ColorScheme; text: string }) {
  const [backgroundColor, constrast] = useColor(color);
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={[styles.text, { color: constrast }]}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.Small,
    marginTop: -1,
    marginBottom: 2
  },
  text: {
    fontSize: FontSize.Medium,
    textAlign: 'center'
  }
});
