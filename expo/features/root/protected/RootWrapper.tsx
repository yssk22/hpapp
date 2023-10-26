import { useColor } from '@hpapp/contexts/settings/theme';
import { View } from 'react-native';

export default function RootWrapper({ children }: { children: React.ReactElement }) {
  const [background] = useColor('background');
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: background
      }}
    >
      {children}
    </View>
  );
}
