import { App } from './features/app';
import { ScreenList } from './features/common/stack';
import Screens from './generated/Screens';

export default function HPApp() {
  return <App screens={Screens as ScreenList} />;
}
