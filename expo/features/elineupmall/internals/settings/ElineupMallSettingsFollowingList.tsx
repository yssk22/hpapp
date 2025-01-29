import { useArtistList } from '@hpapp/features/app/user';
import { useMemo } from 'react';

import ElineupMallSettingsFollowingListItem from './ElineupMallSettingsFollowingListItem';

export default function ElineupMallSettingsFollowings() {
  const artists = useArtistList(false);
  const components = useMemo(() => {
    const list = [];
    for (const artist of artists) {
      if (artist.myFollowStatus?.type === 'follow' || artist.myFollowStatus?.type === 'follow_with_notification') {
        list.push(<ElineupMallSettingsFollowingListItem key={artist.id} obj={artist} />);
      }
      for (const members of artist.members) {
        if (members.myFollowStatus?.type === 'follow' || members.myFollowStatus?.type === 'follow_with_notification') {
          list.push(<ElineupMallSettingsFollowingListItem key={members.id} obj={members} />);
        }
      }
    }
    return list;
  }, [artists]);
  return <>{components}</>;
}
