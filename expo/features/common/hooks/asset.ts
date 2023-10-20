import { useState, useEffect, useContext } from "react";
import * as FileSystem from "expo-file-system";
import { useAssets } from "expo-asset";

const useAssetContent = (moduleId: number): [string, boolean] => {
  const [assets] = useAssets([moduleId]);
  const [state, setState] = useState<{
    value: string;
    isLoading: boolean;
  }>({ value: "", isLoading: true });
  useEffect(() => {
    (async () => {
      if (assets && assets[0].localUri) {
        const value = await FileSystem.readAsStringAsync(assets[0].localUri);
        setState({
          value: value,
          isLoading: false,
        });
      }
    })();
  }, [assets]);
  return [state.value, state.isLoading];
};

export default useAssetContent;
