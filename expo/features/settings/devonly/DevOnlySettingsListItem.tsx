import Text from '@hpapp/features/common/components/Text';
import { ListItem } from '@rneui/themed';

export default function DevOnlySettingsListItem({
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
          // console output so that developer can copy on their terminal.
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
