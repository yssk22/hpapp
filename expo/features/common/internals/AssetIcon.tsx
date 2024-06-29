import { Icon } from '@rneui/themed';

import AmebloIcon from './AmebloIcon';

export type AssetIconType = 'ameblo' | 'instagram' | 'twitter';

const AssetIcon: React.FC<{
  type: AssetIconType | undefined;
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
