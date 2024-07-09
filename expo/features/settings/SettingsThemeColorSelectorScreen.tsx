import { defineScreen, useScreenTitle } from '@hpapp/features/common/stack';
import { ThemeColorScheme } from '@hpapp/system/theme';

import SettingsThemeColorSelectorContainer from './internals/SettingsThemeColorSelectorContainer';

export default defineScreen(
  '/settings/theme/colors/',
  function SettingsThemeColorSelectorScreen({ title, scheme }: { title: string; scheme: ThemeColorScheme }) {
    useScreenTitle(title);
    return <SettingsThemeColorSelectorContainer scheme={scheme} />;
  }
);
