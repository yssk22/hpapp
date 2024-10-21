import { useThemeColor } from '@hpapp/features/app/theme';
import { Text } from '@hpapp/features/common';
import { FontSize } from '@hpapp/features/common/constants';
import { StyleSheet, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';

export type FeedItemCTAProps = {
  icon?: JSX.Element;
  label: string;
  onPress?: () => void;
};

export default function FeedItemCTA({ icon, label, onPress }: FeedItemCTAProps) {
  const [color] = useThemeColor('secondary');
  return (
    <Pressable style={styles.pressable}>
      <TouchableOpacity onPress={onPress} style={styles.container}>
        {icon ? icon : <ActivityIndicator size="small" color={color} />}
        <Text style={styles.text}>{label}</Text>
      </TouchableOpacity>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: FontSize.XSmall
  }
});
