import { useHelloProject } from '@hpapp/features/app/user';

import ElineupMallSettingsFollowingMember from './ElineupMallSettingsFollowingMember';

export default function ElineupMallSettingsFollowings() {
  const followings = useHelloProject()!.useFollowingMembers(false);

  return (
    <>
      {followings.map((member) => (
        <ElineupMallSettingsFollowingMember key={member.id} member={member} />
      ))}
    </>
  );
}
