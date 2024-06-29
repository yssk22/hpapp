import { useThemeColor } from '@hpapp/features/app/theme';
import { View } from 'react-native';

export default function UserWrpper({ children }: { children: React.ReactElement }) {
  const [background] = useThemeColor('background');
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
