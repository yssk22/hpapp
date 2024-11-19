import Ionicon from '@expo/vector-icons/Ionicons';

import AmebloIcon from './AmebloIcon';
import ExternalImage from './ExternalImage';

export type AssetIconProps = {
  size: number;
  type: 'ameblo' | 'elineupmall' | 'instagram' | 'tiktok' | 'twitter' | 'youtube' | '%future added value';
};

export default function AssetIcon({ type, size }: AssetIconProps) {
  switch (type) {
    case 'ameblo':
      return <AmebloIcon size={size} />;
    case 'instagram':
      return <Ionicon name="logo-instagram" size={size} />;
    case 'twitter':
      return <Ionicon name="logo-twitter" size={size} color="#1da1f2" />;
    case 'elineupmall':
      return (
        <ExternalImage
          cachePolicy="disk"
          uri="https://cdn.elineupmall.com/images/logos/2/favicon_3h0z-m5.ico"
          width={size}
          height={size}
        />
      );
    default:
      return null;
  }
}
