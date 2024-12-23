import { useHelloProject } from '@hpapp/features/app/user';
import { ScrollView } from 'react-native';

import ElineupMallSettingsFollowingMember from './ElineupMallSettingsFollowingMember';

export default function ElineupMallSettingsFollowings() {
  const followings = useHelloProject()!.useFollowingMembers(false);

  return (
    <ScrollView>
      {followings.map((member) => (
        <ElineupMallSettingsFollowingMember key={member.id} member={member} />
      ))}
    </ScrollView>
  );
}
