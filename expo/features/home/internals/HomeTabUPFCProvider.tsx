import { useAppConfig, useUPFCConfig } from '@hpapp/features/app/settings';
import { useUPFCEventApplications } from '@hpapp/features/upfc';
import { createContext, useContext, useMemo } from 'react';

export type UPFCContext = ReturnType<typeof useUPFCEventApplications>;

const upfcContext = createContext<UPFCContext | null>(null);

export default function HomeTabUPFCProvider({ children }: { children: React.ReactElement }) {
  const appConfig = useAppConfig();
  const upfcConfig = useUPFCConfig();
  const params = useMemo(() => {
    return {
      username: upfcConfig?.username ?? '',
      password: upfcConfig?.password ?? '',
      useDemo: appConfig.useUPFCDemoScraper
    };
  }, [upfcConfig?.username, upfcConfig?.password, appConfig.useUPFCDemoScraper]);

  const result = useUPFCEventApplications(params);
  return <upfcContext.Provider value={result}>{children}</upfcContext.Provider>;
}

export function useHomeTabUPFC() {
  const value = useContext(upfcContext);
  return value!;
}
