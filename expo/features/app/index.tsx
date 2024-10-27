import { maybeDev } from '@hpapp/foundation/environment';
import { LocalMediaManagerProvider } from '@hpapp/system/media';

import AppRelayProvider from './internals/AppRelayProvider';
import { default as Root, AppRootProps as RootProps } from './internals/AppRoot';
import AppUpdateBanner from './internals/AppUpdateBanner';
import { ThemeProvider, ThemeProviderProps } from './theme';

export type AppRootProps = RootProps & ThemeProviderProps;

export function AppRoot({ screens, ...props }: AppRootProps) {
  return (
    <ThemeProvider {...props}>
      <AppRelayProvider>
        <LocalMediaManagerProvider name={maybeDev() ? 'hellofanapp-dev' : 'hellofanapp'}>
          <AppUpdateBanner />
          <Root screens={screens} />
        </LocalMediaManagerProvider>
      </AppRelayProvider>
    </ThemeProvider>
  );
}
