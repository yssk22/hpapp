import { useAssets } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { useState, useEffect } from 'react';

const useAssetContent = (moduleId: number): [string, boolean] => {
  const [assets] = useAssets([moduleId]);
  const [state, setState] = useState<{
    value: string;
    isLoading: boolean;
  }>({ value: '', isLoading: true });
  useEffect(() => {
    (async () => {
      if (assets?.[0].localUri) {
        const value = await FileSystem.readAsStringAsync(assets[0].localUri);
        setState({
          value,
          isLoading: false
        });
      }
    })();
  }, [assets]);
  return [state.value, state.isLoading];
};

export default useAssetContent;
