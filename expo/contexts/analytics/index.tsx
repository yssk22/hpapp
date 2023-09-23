import React, { createContext, useContext } from "react";

export interface Analytics {
  logEvent(name: string, properties?: Record<string, any>): Promise<void>;
}

const defaultAnalytics = {
  logEvent(name: string, properties?: Record<string, any>): Promise<void> {
    return new Promise((resolve) => {
      resolve();
    });
  },
};

const ctx = createContext<Analytics>(defaultAnalytics);

export function AnalyticsProvider({
  analytics = defaultAnalytics,
  children,
}: {
  analytics?: Analytics;
  children: React.ReactNode;
}) {
  const Provider = ctx.Provider;
  return <Provider value={analytics}>{children}</Provider>;
}

export function useAnalytics(): Analytics {
  return useContext(ctx);
}
