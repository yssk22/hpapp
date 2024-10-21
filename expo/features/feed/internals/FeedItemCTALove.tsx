import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useThemeColor } from '@hpapp/features/app/theme';
import { IconSize } from '@hpapp/features/common/constants';

import FeedItemCTA from './FeedItemCTA';

export function FeedItemCTALove() {
  const [color] = useThemeColor('secondary');
  return <FeedItemCTA label="Love" icon={<FontAwesome name="heart" color={color} size={IconSize.Medium} />} />;
}
