import { useEffect, useState } from 'react';

/**
 * run a list of initializers before rendering children
 * @param initializers
 * @returns
 */
export default function Initializer({
  initializers,
  children
}: {
  initializers: (() => Promise<void>)[];
  children: React.ReactElement;
}) {
  const [state, setState] = useState(false);
  useEffect(() => {
    if (!state) {
      Promise.all(initializers.map((i) => i())).then(() => {
        setState(true);
      });
    }
  }, initializers);
  if (!state) {
    return <></>;
  }
  return <>{children}</>;
}
