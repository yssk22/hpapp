import { defineScreen } from '@hpapp/features/common/stack';

import HomeProvider from './internals/HomeProvider';
import HomeTab from './internals/HomeTab';

export default defineScreen('/', function HomeScreen() {
  return (
    <HomeProvider>
      <HomeTab />
    </HomeProvider>
  );
});
