import { useLogout } from '@hpapp/features/auth';
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

import HelloProject, { HPArtist, HPMember, useHelloProjectFragment } from './HelloProject';
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

export function useArtistMap(): ReadonlyMap<string, HPArtist> {
  const { hp } = useContext(ctx)!;
  return hp.artistMap;
}

export function useArtistList(includeOG: boolean = false): readonly HPArtist[] {
  const { hp } = useContext(ctx)!;
  return useMemo(() => {
    if (includeOG) {
      return hp.artistList;
    }
    const artistList = hp.artistList.map((a) => {
      return {
        ...a,
        members: a.members.filter((m) => m.graduateAt === null)
      };
    });
    return artistList.filter((a) => a.members.length > 0);
  }, [hp, includeOG]);
}

export function useArtist(id: string, includeOG: boolean = false): HPArtist | null {
  const { hp } = useContext(ctx)!;
  return useMemo(() => {
    const artist = hp.artistMap.get(id);
    if (!artist) {
      return null;
    }
    if (includeOG) {
      return artist;
    }
    return {
      ...artist,
      members: artist.members.filter((m) => m.graduateAt === null)
    };
  }, [hp, id, includeOG]);
}

export function useMemberMap(): ReadonlyMap<string, HPMember> {
  const { hp } = useContext(ctx)!;
  return hp.memberMap;
}

export function useMemberList(includeOG: boolean = false): readonly HPMember[] {
  const { hp } = useContext(ctx)!;
  return useMemo(() => {
    if (includeOG) {
      return hp.memberList;
    }
    return hp.memberList.filter((m) => m.graduateAt === null);
  }, [hp, includeOG]);
}

export function useMember(id: string): HPMember | null {
  const { hp } = useContext(ctx)!;
  return useMemo(() => {
    return hp.memberMap.get(id) ?? null;
  }, [hp, id]);
}

export function useFollowingArtistList(includeOG: boolean = false) {
  const artists = useArtistList(includeOG);
  return useMemo(() => {
    return artists.filter(
      (a) => a.myFollowStatus?.type === 'follow' || a.myFollowStatus?.type === 'follow_with_notification'
    );
  }, [artists]);
}

export function useFollowingMemberList(includeOG: boolean = false) {
  const members = useMemberList(includeOG);
  return useMemo(() => {
    return members.filter(
      (m) => m.myFollowStatus?.type === 'follow' || m.myFollowStatus?.type === 'follow_with_notification'
    );
  }, [members]);
}

export function useMe(): Me {
  const { me } = useContext(ctx)!;
  return me;
}

export function useReloadUserContext(): [() => Promise<void>, boolean] {
  const { reload, isReloading } = useContext(ctx)!;
  return [reload, isReloading];
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

  const logout = useLogout();
  useEffect(() => {
    if (me.username === 'guest') {
      logout();
    }
  }, [me.username]);
  if (me.username === 'guest') {
    return null;
  }
  return <ctx.Provider value={serviceRoot}>{children}</ctx.Provider>;
}
