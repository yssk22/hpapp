import React, { useCallback, useState } from "react";
import { Text } from "react-native";
import { renderError } from "@hpapp/foundation/errors";

export default function useErrorMessage(): [
  ({ testID = "errorMessage" }: { testID?: string }) => React.ReactElement,
  (e: unknown) => void
] {
  const [error, setError] = useState<string | null>(null);
  const setErrorMessage = useCallback(
    (e: unknown) => {
      setError(renderError(e));
    },
    [setError]
  );
  const component = useCallback(
    ({ testID = "errorMessage" }: { testID?: string }) => (
      <>{error && <Text testID={testID}>{error}</Text>}</>
    ),
    [error]
  );
  return [component, setErrorMessage];
}
