import { useElineupMallPurchaseHistory } from '@hpapp/features/elineupmall/scraper';
import { createContext, useContext } from 'react';

export type ElineupMallContext = ReturnType<typeof useElineupMallPurchaseHistory>;

const elineupMallContext = createContext<ElineupMallContext | null>(null);

export default function HomeTabElineupMallProvider({ children }: { children: React.ReactElement }) {
  const result = useElineupMallPurchaseHistory();
  return <elineupMallContext.Provider value={result}>{children}</elineupMallContext.Provider>;
}

export function useHomeTabElineupMall() {
  const value = useContext(elineupMallContext);
  return value!;
}
