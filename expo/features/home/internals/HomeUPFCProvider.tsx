import { useUPFCEventApplications } from '@hpapp/features/upfc';
import { createContext, useContext } from 'react';

export type UPFCContext = ReturnType<typeof useUPFCEventApplications>;

const upfcContext = createContext<UPFCContext | null>(null);

export default function HomeUPFCProvider({ children }: { children: React.ReactElement }) {
  const result = useUPFCEventApplications();
  return <upfcContext.Provider value={result}>{children}</upfcContext.Provider>;
}

export function useHomeUPFC() {
  const value = useContext(upfcContext);
  return value!;
}
