import AppUpdateBanner from '@hpapp/features/root/banner/AppUpdateBanner';
import { useColor } from '@hpapp/features/settings/context/theme';
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
