import Feather from '@expo/vector-icons/Feather';
import { useThemeColor } from '@hpapp/features/app/theme';
import { IconSize } from '@hpapp/features/common/constants';
import { t } from '@hpapp/system/i18n';
import Share from 'react-native-share';

import FeedItemCTA from './FeedItemCTA';

export type FeedItemCTAShareProps = {
  url: string;
};

export function FeedItemCTAShare(props: FeedItemCTAShareProps) {
  const [color] = useThemeColor('secondary');
  return (
    <FeedItemCTA
      label="Share"
      icon={<Feather name="share" color={color} size={IconSize.Medium} />}
      onPress={async () => {
        await Share.open({
          url: props.url,
          message: t('via @hellofanapp')
        });
      }}
    />
  );
}
