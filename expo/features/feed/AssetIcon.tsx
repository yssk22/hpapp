import { HPFeedItemHPAssetType } from '@hpapp/features/feed/__generated__/FeedListItemFragment.graphql';
import AmebloIcon from '@hpapp/features/feed/ameblo/AmebloIcon';
import { Icon } from '@rneui/themed';

const AssetIcon: React.FC<{
  type: HPFeedItemHPAssetType | undefined;
  size: number;
}> = ({ type, size }) => {
  switch (type) {
    case 'ameblo':
      return <AmebloIcon size={size} />;
    case 'instagram':
      return <Icon type="ionicon" name="logo-instagram" size={size} />;
    case 'twitter':
      return <Icon type="ionicon" name="logo-twitter" size={size} color="#1da1f2" />;
    default:
      return null;
  }
};

export default AssetIcon;
