import { ErrorBoundary } from '@hpapp/features/common';
import { maybeDev } from '@hpapp/foundation/environment';
import { LocalMediaManagerProvider } from '@hpapp/system/media';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppGlobalErrorFallback from './internals/AppGlobalErrorFallback';
import AppRelayProvider from './internals/AppRelayProvider';
import AppRoot, { AppRootProps } from './internals/AppRoot';
import AppUpdateBanner from './internals/AppUpdateBanner';
import { ThemeProvider, ThemeProviderProps } from './theme';

export type AppProps = AppRootProps & ThemeProviderProps;

export function App({ screens, ...props }: AppProps) {
  return (
    <SafeAreaProvider testID="app.SafeAreaProvider">
      <ThemeProvider {...props}>
        <AppRelayProvider>
          <LocalMediaManagerProvider name={maybeDev() ? 'hellofanapp-dev' : 'hellofanapp'}>
            <ErrorBoundary fallback={AppGlobalErrorFallback}>
              <AppRoot screens={screens} />
            </ErrorBoundary>
            <AppUpdateBanner />
          </LocalMediaManagerProvider>
        </AppRelayProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
