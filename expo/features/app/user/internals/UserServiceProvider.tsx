import { Loading } from '@hpapp/features/common';
import { Suspense, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  graphql,
  useQueryLoader,
  usePreloadedQuery,
  PreloadedQuery,
  useRelayEnvironment,
  fetchQuery
} from 'react-relay';

import HelloProject, { useHelloProjectFragment } from './HelloProject';
import Me, { useMeFragment } from './Me';
import { UserServiceProviderQuery } from './__generated__/UserServiceProviderQuery.graphql';

const UserServiceProviderQueryGraphQL = graphql`
  query UserServiceProviderQuery {
    helloproject {
      ...HelloProjectFragment
    }
    me {
      ...MeFragment
    }
  }
`;

type ServiceRoot = {
  hp: HelloProject;
  me: Me;
  isReloading: boolean;
  reload: () => Promise<void>;
};

const ctx = createContext<ServiceRoot | null>(null);

export default function UserServiceProvider({
  loadingFallback = <Loading testID="UserServiceProvider.Loading" />,
  children
}: {
  loadingFallback?: React.ReactElement;
  children: React.ReactElement;
}) {
  const key = useRelayEnvironment().configName;
  return (
    <Suspense fallback={loadingFallback}>
      <LoadServiceRootQuery key={key}>{children}</LoadServiceRootQuery>
    </Suspense>
  );
}

function LoadServiceRootQuery({ children }: { children: React.ReactElement }) {
  const env = useRelayEnvironment();
  const [queryRef, loadQuery, dispose] = useQueryLoader<UserServiceProviderQuery>(UserServiceProviderQueryGraphQL);
  const [isReloading, setIsReloading] = useState(false);
  // use fetchQuery to avoid triggering suspense.
  const reload = useCallback(async () => {
    setIsReloading(true);
    try {
      await fetchQuery(env, UserServiceProviderQueryGraphQL, {}).toPromise();
      loadQuery(
        {},
        {
          fetchPolicy: 'store-only'
        }
      );
      // TODO: error handling
    } finally {
      setIsReloading(false);
    }
  }, [loadQuery]);

  useEffect(() => {
    loadQuery({});
    return () => {
      dispose();
    };
  }, [loadQuery]);
  if (queryRef === null || queryRef === undefined) {
    return <></>;
  }
  return (
    <RenderServiceRootQuery queryRef={queryRef} reload={reload} isReloading={isReloading}>
      {children}
    </RenderServiceRootQuery>
  );
}

export function useUserServiceContext() {
  return useContext(ctx)!;
}

function RenderServiceRootQuery({
  queryRef,
  reload,
  isReloading,
  children
}: {
  queryRef: PreloadedQuery<UserServiceProviderQuery, Record<string, unknown>>;
  reload: () => Promise<void>;
  isReloading: boolean;
  children: React.ReactElement;
}) {
  const data = usePreloadedQuery<UserServiceProviderQuery>(UserServiceProviderQueryGraphQL, queryRef);
  const hp = useHelloProjectFragment(data.helloproject);
  const me = useMeFragment(data.me);
  const serviceRoot = useMemo(() => {
    return {
      hp,
      me,
      reload,
      isReloading
    };
  }, [hp, me, reload, isReloading]);
  return <ctx.Provider value={serviceRoot}>{children}</ctx.Provider>;
}
