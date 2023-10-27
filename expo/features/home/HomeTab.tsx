import HomeTabFeed from '@hpapp/features/home/HomeTabFeed';
import { UPFCProvider } from '@hpapp/features/upfc/context';
import { View } from 'react-native';

export default function HomeTab() {
  return (
    <View style={{ flex: 1 }}>
      <UPFCProvider>
        <HomeTabFeed />
      </UPFCProvider>
    </View>
  );
}
