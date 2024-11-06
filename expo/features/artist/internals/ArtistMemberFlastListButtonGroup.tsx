import { AssetIcon } from '@hpapp/features/common';
import { IconSize } from '@hpapp/features/common/constants';
import { HPAssetType } from '@hpapp/features/feed';
import { ButtonGroup } from '@rneui/themed';
import { useState } from 'react';

export type ArtistMemberFlatListButtonGroupProps = {
  onPress: (assetType: HPAssetType) => void;
};

export default function ArtistMemberFlatListButtonGroup({ onPress }: ArtistMemberFlatListButtonGroupProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <ButtonGroup
      buttons={[
        <AssetIcon type="ameblo" size={IconSize.Medium} />,
        <AssetIcon type="instagram" size={IconSize.Medium} />
      ]}
      selectedIndex={selectedIndex}
      onPress={(index) => {
        switch (index) {
          case 0:
            setSelectedIndex(0);
            onPress('ameblo');
            break;
          case 1:
            setSelectedIndex(1);
            onPress('instagram');
            break;
          default:
            throw new Error('Invalid index');
        }
      }}
    />
  );
}
