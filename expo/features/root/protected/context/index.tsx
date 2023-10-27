import ErrorBoundary from '@hpapp/features/misc/ErrorBoundary';
import { servicerootQuery } from '@hpapp/features/root/protected/context/__generated__/servicerootQuery.graphql';
import {
  HelloProject,
  useHelloprojectFragment,
  HPArtist,
  HPMember
} from '@hpapp/features/root/protected/context/helloproject';
import { useMeFragment, Me } from '@hpapp/features/root/protected/context/me';
import { Suspense, createContext, useContext, useEffect, useMemo } from 'react';
import { graphql, useQueryLoader, usePreloadedQuery, PreloadedQuery } from 'react-relay';

const servicerootQueryGraphQL = graphql`
  query servicerootQuery {
    helloproject {
      ...helloprojectFragment
    }
    me {
      ...meFragment
    }
  }
`;

type ServiceRoot = {
  hp: HelloProject;
  me: Me;
  reload: () => void;
};

const ctx = createContext<ServiceRoot | null>(null);

function ServiceRootProvider({
  errorFallback,
  loadingFallback,
  children
}: {
  errorFallback: React.ReactElement;
  loadingFallback: React.ReactElement;
  children: React.ReactElement;
}) {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={loadingFallback}>
        <LoadServiceRootQuery>{children}</LoadServiceRootQuery>
      </Suspense>
    </ErrorBoundary>
  );
}

function LoadServiceRootQuery({ children }: { children: React.ReactElement }) {
  const [queryRef, loadQuery] = useQueryLoader<servicerootQuery>(servicerootQueryGraphQL);
  const load = useMemo(() => {
    return () => loadQuery({});
  }, [loadQuery]);

  useEffect(() => {
    load();
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

function RenderServiceRootQuery({
  queryRef,
  reload,
  children
}: {
  queryRef: PreloadedQuery<servicerootQuery, Record<string, unknown>>;
  reload: () => void;
  children: React.ReactElement;
}) {
  const data = usePreloadedQuery<servicerootQuery>(servicerootQueryGraphQL, queryRef);
  const hp = useHelloprojectFragment(data.helloproject);
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

function useHelloProject() {
  const value = useContext(ctx);
  return value!.hp;
}

function useMe() {
  const value = useContext(ctx);
  return value!.me;
}

function useSeviveRootReload() {
  const value = useContext(ctx);
  return value!.reload;
}

export { HPArtist, HPMember, ServiceRootProvider, useHelloProject, useMe, useSeviveRootReload };
