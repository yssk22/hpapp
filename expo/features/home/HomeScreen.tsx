import { defineScreen } from '@hpapp/features/common/stack';

import HomeTab from './internals/HomeTab';

export default defineScreen('/', function HomeScreen() {
  return <HomeTab />;
});
