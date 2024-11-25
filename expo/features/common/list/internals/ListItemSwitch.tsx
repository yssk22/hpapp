import { Spacing } from '@hpapp/features/common/constants';
import { Switch } from '@rneui/themed';
import { StyleSheet } from 'react-native';

import ListItem from './ListItem';

export type ListItemSwitchProps = {
  label: string | React.ReactNode;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export default function ListItemSwitch({ value, onValueChange, label }: ListItemSwitchProps) {
  return (
    <ListItem
      containerStyle={styles.container}
      rightContent={
        <Switch
          value={value}
          onValueChange={() => {
            onValueChange(!value);
          }}
        />
      }
    >
      {label}
    </ListItem>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.Small
  }
});
