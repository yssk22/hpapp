import { createContext, useContext, useEffect, useState } from 'react';

import LocalMediaManager from './internals/LocalMediaManager';

type LocalMediaManagerContext = {
  lmm: LocalMediaManager | null;
};

const lmmContext = createContext<LocalMediaManagerContext>({
  lmm: null
});

function LocalMediaManagerProvider({ name, children }: { name: string; children: React.ReactNode }) {
  const [lmm, setLMM] = useState<LocalMediaManager | null>(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      const _lmm = new LocalMediaManager(name);
      await _lmm.init();
      if (mounted) {
        setLMM(_lmm);
      }
      return () => {
        mounted = false;
      };
    })();
  }, [name, setLMM]);
  if (lmm === null) {
    return null;
  }
  return <lmmContext.Provider value={{ lmm }}>{children}</lmmContext.Provider>;
}

function useLocalMediaManager() {
  return useContext(lmmContext).lmm!;
}

export { LocalMediaManagerProvider, useLocalMediaManager, LocalMediaManager };
