import { Text } from '@hpapp/features/common';
import { ListItem } from '@rneui/themed';

export default function DevtoolListItem({
  name,
  value,
  displayValue
}: {
  name: string;
  value: string;
  displayValue?: string;
}) {
  return (
    <>
      <ListItem
        onPress={() => {
          // intentional console output so that developer can copy on their terminal.
          // eslint-disable-next-line no-console
          console.log('Settings', name, ':', value);
        }}
      >
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
