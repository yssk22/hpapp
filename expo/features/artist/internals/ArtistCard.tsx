import { useThemeColor } from '@hpapp/features/app/theme';
import { HPArtist, HPMember } from '@hpapp/features/app/user';
import { ArtistIcon } from '@hpapp/features/artist';
import { Text } from '@hpapp/features/common';
import { Card } from '@hpapp/features/common/card';
import { FontSize, Spacing } from '@hpapp/features/common/constants';
import { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';

import ArtistMemberIcon, { ArtistMemberIconSize } from './ArtistMemberIcon';

const MemberIconSize = 60;
const MemberIconMargin = MemberIconSize / 10;

export type ArtistCardProps = {
  artist: HPArtist;
  memberIconCircle?: boolean;
  memberIconShowFollow?: boolean;
  onArtistIconPress?: (artist: HPArtist) => void;
  onMemberIconPress?: (member: HPMember) => void;
};

export default function ArtistCard({
  artist,
  memberIconCircle,
  memberIconShowFollow,
  onArtistIconPress,
  onMemberIconPress
}: ArtistCardProps) {
  const [, primaryContrast] = useThemeColor('primary');
  const [componentWidth, setComponentWidth] = useState(0);
  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (componentWidth !== width) {
      setComponentWidth(width);
    }
  }, []);
  const members = useMemo(() => {
    return (artist.members ?? []).filter((m) => m.graduateAt === null);
  }, [artist]);
  const paddings = useMemo(() => {
    const membersPerRow = Math.floor(componentWidth / (MemberIconSize + MemberIconMargin * 2));
    if (membersPerRow === 0) {
      return [];
    }
    const lastRowNum = (members?.length || 0) % membersPerRow;
    if (lastRowNum === 0) {
      return [];
    }
    const numPadding = membersPerRow - lastRowNum;
    return new Array(numPadding).fill(0);
  }, [componentWidth, members]);
  return (
    <Card
      key={artist.key}
      containerStyle={styles.card}
      header={
        <View style={styles.cardHeader}>
          <Text numberOfLines={1} style={[styles.cardHeaderText, { color: primaryContrast }]}>
            {artist.name}
          </Text>
          <ArtistIcon
            artistId={artist.id}
            size={50}
            onPress={
              onArtistIconPress
                ? () => {
                    onArtistIconPress(artist);
                  }
                : undefined
            }
          />
        </View>
      }
      body={
        <View style={styles.membersContainer} onLayout={handleLayout}>
          {members.map((m) => {
            return (
              <View style={styles.memberIcon} key={m.key}>
                <ArtistMemberIcon
                  memberId={m.id}
                  size={ArtistMemberIconSize.Medium}
                  circle={memberIconCircle}
                  showFollowIcon={memberIconShowFollow}
                  onPress={
                    onMemberIconPress
                      ? () => {
                          onMemberIconPress(m);
                        }
                      : undefined
                  }
                />
              </View>
            );
          })}
          {paddings.map((_, i) => {
            return <View style={[styles.padding, styles.memberIcon]} key={`padding_${i}`} />;
          })}
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  membersContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
  card: {
    padding: 0
  },
  cardHeader: {
    margin: 0,
    padding: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardHeaderText: {
    fontSize: FontSize.MediumLarge
  },
  memberIcon: {
    marginRight: MemberIconMargin,
    marginLeft: MemberIconMargin,
    marginBottom: Spacing.Medium
  },
  padding: {
    width: MemberIconSize,
    height: MemberIconSize
  }
});
