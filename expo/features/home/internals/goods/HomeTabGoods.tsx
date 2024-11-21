import { useHelloProject } from '@hpapp/features/app/user';
import { ElineupMallLimitedTimeItemList } from '@hpapp/features/elineupmall';

export default function HomeTabGoods() {
  const followings = useHelloProject()!
    .useFollowingMembers(true)
    .map((m) => m.id);
  return <ElineupMallLimitedTimeItemList memberIds={followings} />;
}
