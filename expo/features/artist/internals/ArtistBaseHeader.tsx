import { HPArtist, HPMember } from '@hpapp/features/app/user';
import { Spacing } from '@hpapp/features/common/constants';
import { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';

import ArtistBaseFollowButton from './ArtistBaseFollowButton';
import ArtistBaseIcon from './ArtistBaseIcon';
import { ArtistMemberIconSize } from './ArtistMemberIcon';

export type ArtistBaseHeaderProps = {
  obj: HPArtist | HPMember;
  info: ReactElement;
};

export default function ArtistBaseHeader({ obj, info }: ArtistBaseHeaderProps) {
  return (
    <View style={styles.containerRow}>
      <View style={styles.thumbnailColumn}>
        <ArtistBaseIcon thumbnailUrl={obj.thumbnailURL} size={96} circle />
      </View>
      <View style={styles.info}>
        {info}
        <View style={styles.followContainer}>
          <ArtistBaseFollowButton obj={obj} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerRow: {
    alignItems: 'center',
    marginTop: Spacing.Small,
    marginLeft: Spacing.Small,
    marginRight: Spacing.Small,
    flexDirection: 'row'
  },
  thumbnailColumn: {
    width: ArtistMemberIconSize.Large
  },
  info: {
    flexGrow: 1,
    marginLeft: Spacing.Medium,
    justifyContent: 'flex-end'
  },
  followContainer: {
    paddingTop: Spacing.Small,
    paddingBottom: Spacing.Small,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
