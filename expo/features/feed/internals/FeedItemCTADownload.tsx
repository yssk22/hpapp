import Feather from '@expo/vector-icons/Feather';
import { useThemeColor } from '@hpapp/features/app/theme';
import { IconSize } from '@hpapp/features/common/constants';

import FeedItemCTA from './FeedItemCTA';

export function FeedItemCTADownload() {
  const [color] = useThemeColor('secondary');
  return <FeedItemCTA label="Download" icon={<Feather name="download" color={color} size={IconSize.Medium} />} />;
}
