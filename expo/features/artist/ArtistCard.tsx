import MemberIcon from '@hpapp/features/artist/MemberIcon';
import Text from '@hpapp/features/common/components/Text';
import { Spacing } from '@hpapp/features/common/constants';
import { HPArtist } from '@hpapp/features/root/internals/protected/context/helloproject';
import { Card } from '@rneui/themed';
import { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';

const MemberIconSize = 60;
const MemberIconMargin = MemberIconSize / 10;

export default function ArtistCard({ artist }: { artist: HPArtist }) {
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
    <Card>
      <Card.Title>
        <Text bold style={{ textAlign: 'left' }}>
          {artist.name}
        </Text>
      </Card.Title>
      <Card.Divider />
      <View style={styles.membersContainer} onLayout={handleLayout}>
        {members.map((m) => {
          return (
            <View style={styles.memberIcon} key={m.key}>
              <MemberIcon member={m} size={MemberIconSize} />
            </View>
          );
        })}
        {paddings.map((_, i) => {
          return <View style={[styles.padding, styles.memberIcon]} key={`padding_${i}`} />;
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  membersContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
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
