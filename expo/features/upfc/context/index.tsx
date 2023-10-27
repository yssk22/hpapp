import {
  DemoScraper,
  EventApplicationTickets,
  ScraperParams,
  useUPFCEventApplications
} from '@hpapp/features/upfc/scraper';
import useUPFCSettings from '@hpapp/features/upfc/settings/useUPFCSettings';
import React, { createContext, useContext, useMemo } from 'react';

export interface UPFCContext {
  isConfigured: boolean;
  isLoading: boolean;
  data: EventApplicationTickets[] | null;
  reload: () => void;
}

const contextObj = createContext<UPFCContext>({
  isConfigured: false,
  data: null,
  isLoading: false,
  reload: () => {}
});

function UPFCProvider({ children }: { children: React.ReactNode }) {
  const [config] = useUPFCSettings();
  if (config?.username && config?.password) {
    const useDemo = config.username === DemoScraper.Username;
    return (
      <UPFCSync username={config.username} password={config.password} useDemo={useDemo}>
        {children}
      </UPFCSync>
    );
  }
  const Provider = contextObj.Provider;
  return (
    <Provider
      value={{
        isConfigured: false,
        data: null,
        isLoading: false,
        reload: () => {}
      }}
    >
      {children}
    </Provider>
  );
}

function UPFCSync({ username, password, useDemo, children }: { children?: React.ReactNode } & ScraperParams) {
  const Provider = contextObj.Provider;
  const [data, isLoading, reload] = useUPFCEventApplications({
    username,
    password,
    useDemo
  });
  const value = useMemo(() => {
    return {
      isConfigured: false,
      data,
      isLoading,
      reload
    };
  }, [data, isLoading, reload]);
  return <Provider value={value}>{children}</Provider>;
}

function useUPFC() {
  return useContext(contextObj);
}

export { UPFCProvider, useUPFC };
