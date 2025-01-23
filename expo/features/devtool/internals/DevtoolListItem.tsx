import { ListItemKeyValue } from '@hpapp/features/common/list';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-root-toast';

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
    <ListItemKeyValue
      name={name}
      value={value}
      displayValue={displayValue}
      onPress={() => {
        // intentional console output so that developer can copy on their terminal.
        // eslint-disable-next-line no-console
        console.log('Settings', name, ':', value);
        Clipboard.setStringAsync(value);
        Toast.show('copied to clipboard');
      }}
    />
  );
}
