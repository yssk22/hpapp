import { HPArtist } from '@hpapp/features/app/user';
import { Spacing } from '@hpapp/features/common/constants';
import { StyleSheet, View } from 'react-native';

import ArtistBaseHeader from './ArtistBaseHeader';

export type ArtistMemberHeaderProps = {
  artist: HPArtist;
};

export default function ArtistHeader({ artist }: ArtistMemberHeaderProps) {
  return <ArtistBaseHeader obj={artist} info={<View style={styles.artistInfo} />} />;
}

const styles = StyleSheet.create({
  artistInfo: {
    flexGrow: 1,
    marginLeft: Spacing.Medium,
    justifyContent: 'flex-end'
  },
  artistInfoRow: {
    paddingTop: Spacing.XXSmall,
    paddingBottom: Spacing.XXSmall,
    flexDirection: 'row'
  },
  artistInfoLabel: {
    fontWeight: 'bold',
    textAlign: 'right',
    width: 70
  },
  memberInfoDateValue: {
    marginLeft: Spacing.Small
  },
  memberInfoDateAppendix: {
    marginLeft: Spacing.Small
  },
  memberInfoFollowButtonContainer: {
    paddingTop: Spacing.Small,
    paddingBottom: Spacing.Small,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
