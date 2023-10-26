import { useEffect, useState } from 'react';

export default function Initialize({
  initializers,
  children
}: {
  initializers: (() => Promise<void>)[];
  children: React.ReactElement;
}) {
  const [, setState] = useState(false);
  useEffect(() => {
    Promise.all(initializers.map((i) => i())).then(() => {
      setState(true);
    });
  }, initializers);
  return <>{children}</>;
}
