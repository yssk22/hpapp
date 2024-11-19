import { defineScreen, useScreenTitle } from '@hpapp/features/common/stack';
import { ThemeColorScheme } from '@hpapp/system/theme';

import ThemeColorSelectorContainer from './internals/ThemeColorSelectorContainer';

export default defineScreen(
  '/theme/colors/',
  function SettingsThemeColorSelectorScreen({ title, scheme }: { title: string; scheme: ThemeColorScheme }) {
    useScreenTitle(title);
    return <ThemeColorSelectorContainer scheme={scheme} />;
  }
);
