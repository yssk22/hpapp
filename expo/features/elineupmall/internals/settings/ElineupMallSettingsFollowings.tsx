import { useFollowingMemberList } from '@hpapp/features/app/user';
import { useMemo } from 'react';

import ElineupMallSettingsFollowingMember from './ElineupMallSettingsFollowingMember';

export default function ElineupMallSettingsFollowings() {
  const followings = useFollowingMemberList(false);
  const components = useMemo(() => {
    return followings.map((member) => <ElineupMallSettingsFollowingMember key={member.id} member={member} />);
  }, [followings]);
  return <>{components}</>;
}
