import { useMe } from '@hpapp/features/app/user';
import { ElineupMallLimitedTimeItemList } from '@hpapp/features/elineupmall';

export default function HomeTabGoods() {
  const followings = useMe()
    .followings.filter((f) => f.type !== 'unfollow')
    .map((f) => f.memberId);
  return <ElineupMallLimitedTimeItemList memberIds={followings} />;
}
