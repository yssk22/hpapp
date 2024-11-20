import { Text } from '@hpapp/features/common';
import { ListItem } from '@rneui/themed';

export type ListItemKeyValueProps = {
  name: string;
  value: string;
  displayValue?: string;
  onPress?: () => void;
};

export default function ListItemKeyValue({ name, value, displayValue, onPress }: ListItemKeyValueProps) {
  return (
    <>
      <ListItem onPress={onPress}>
        <ListItem.Content>
          <ListItem.Title>
            <Text>{name}</Text>
          </ListItem.Title>
          <ListItem.Subtitle>
            <Text>{displayValue ?? value}</Text>
          </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    </>
  );
}
