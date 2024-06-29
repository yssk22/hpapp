import { AppRoot } from './features/app';
import { ScreenList } from './features/common/stack';
import Screens from './generated/Screens';

export default function App() {
  return <AppRoot screens={Screens as ScreenList} />;
}
