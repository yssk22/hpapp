import { useThemeColor } from '@hpapp/features/app/theme';
import { Text } from '@hpapp/features/common';
import { FontSize, Spacing } from '@hpapp/features/common/constants';
import { View, StyleSheet } from 'react-native';

export default function SectionListHeader({ children }: { children: string }) {
  const [color, constrastColor] = useThemeColor('secondary');
  return (
    <View
      style={{
        flexDirection: 'row'
      }}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: color,
            borderColor: color
          }
        ]}
      >
        <Text style={[styles.text, { color: constrastColor }]}>{children}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: Spacing.Small,
    paddingRight: Spacing.Small,
    paddingTop: Spacing.XXSmall,
    paddingBottom: Spacing.XXSmall,
    margin: Spacing.XSmall,
    borderWidth: 1,
    borderRadius: 8
  },
  text: {
    fontSize: FontSize.Small,
    fontWeight: 'bold'
  }
});
