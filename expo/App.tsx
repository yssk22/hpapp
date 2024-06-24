import Root from './features/root';
import screens from './generated/Screens';

export default function App() {
  // for production build
  return <Root screens={screens} />;
}
