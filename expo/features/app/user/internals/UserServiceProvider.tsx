import { ErrorBoundary, FallbackComponent, Loading } from '@hpapp/features/common';
import { Suspense, createContext, useContext, useEffect, useMemo } from 'react';
import { graphql, useQueryLoader, usePreloadedQuery, PreloadedQuery, useRelayEnvironment } from 'react-relay';

import HelloProject, { useHelloProjectFragment } from './HelloProject';
import Me, { useMeFragment } from './Me';
import UserError from './UserError';
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
  reload: () => void;
};

const ctx = createContext<ServiceRoot | null>(null);

export default function UserServiceProvider({
  errorFallback = UserError,
  loadingFallback = <Loading testID="UserServiceProvider.Loading" />,
  children
}: {
  errorFallback?: FallbackComponent;
  loadingFallback?: React.ReactElement;
  children: React.ReactElement;
}) {
  const key = useRelayEnvironment().configName;
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={loadingFallback}>
        <LoadServiceRootQuery key={key}>{children}</LoadServiceRootQuery>
      </Suspense>
    </ErrorBoundary>
  );
}

function LoadServiceRootQuery({ children }: { children: React.ReactElement }) {
  const [queryRef, loadQuery, dispose] = useQueryLoader<UserServiceProviderQuery>(UserServiceProviderQueryGraphQL);

  const load = useMemo(() => {
    return () => {
      loadQuery({});
    };
  }, [loadQuery]);

  useEffect(() => {
    load();
    return () => {
      dispose();
    };
  }, [loadQuery]);
  if (queryRef === null || queryRef === undefined) {
    return <></>;
  }
  return (
    <RenderServiceRootQuery queryRef={queryRef} reload={load}>
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
  children
}: {
  queryRef: PreloadedQuery<UserServiceProviderQuery, Record<string, unknown>>;
  reload: () => void;
  children: React.ReactElement;
}) {
  const data = usePreloadedQuery<UserServiceProviderQuery>(UserServiceProviderQueryGraphQL, queryRef);
  const hp = useHelloProjectFragment(data.helloproject);
  const me = useMeFragment(data.me);
  const serviceRoot = useMemo(() => {
    return {
      hp,
      me,
      reload
    };
  }, [hp, me]);
  return <ctx.Provider value={serviceRoot}>{children}</ctx.Provider>;
}
