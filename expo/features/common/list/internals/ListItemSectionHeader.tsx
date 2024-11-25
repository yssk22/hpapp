import { useThemeColor } from '@hpapp/features/app/theme';
import { Spacing } from '@hpapp/features/common/constants';
import { Text } from '@rneui/themed';
import { StyleSheet } from 'react-native';

import ListItem from './ListItem';

export type ListItemSectionHeaderProps = {
  label: string;
};

export default function ListItemSectionHeader({ label }: ListItemSectionHeaderProps) {
  const [color, contrastColor] = useThemeColor('disabled');
  return (
    <ListItem containerStyle={[styles.container, { backgroundColor: color }]}>
      <Text style={[styles.label, { color: contrastColor }]}>{label}</Text>
    </ListItem>
  );
}

const styles = StyleSheet.create({
  label: {
    fontWeight: 'bold'
  },
  container: {
    paddingLeft: Spacing.Small,
    paddingRight: Spacing.Small,
    paddingTop: Spacing.Small,
    paddingBottom: Spacing.Small
  }
});
