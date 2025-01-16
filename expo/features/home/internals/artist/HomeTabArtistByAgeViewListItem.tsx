import { HPMember } from '@hpapp/features/app/user';
import { ArtistMemberIcon, ArtistMemberIconSize } from '@hpapp/features/artist/';
import ArtistMemberScreen from '@hpapp/features/artist/ArtistMemberScreen';
import { Text } from '@hpapp/features/common';
import { FontSize, Spacing } from '@hpapp/features/common/constants';
import { useNavigation } from '@hpapp/features/common/stack';
import { toDateString, getAge } from '@hpapp/foundation/date';
import { t } from '@hpapp/system/i18n';
import { Divider, ListItem } from '@rneui/themed';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeTabArtistByAgeViewListItem({ label, members }: { label: string; members: HPMember[] }) {
  const navigation = useNavigation();
  return (
    <>
      <View style={styles.container}>
        <View style={styles.labelContainer}>
          <Text style={styles.label} bold>
            {label}
          </Text>
        </View>
        <View style={styles.membersContainer}>
          {members.map((m) => {
            return (
              <TouchableOpacity
                key={m.id}
                onPress={() => {
                  navigation.navigate(ArtistMemberScreen, { memberId: m.id });
                }}
              >
                <ListItem key={m.key} containerStyle={styles.memberListItem}>
                  <ArtistMemberIcon memberId={m.id} size={ArtistMemberIconSize.Small} />
                  <ListItem.Content>
                    <ListItem.Title style={styles.memberName}>
                      <Text style={styles.memberNameText}>{m.name}</Text>
                    </ListItem.Title>
                    <ListItem.Subtitle>
                      <Text style={styles.memberSubtitleText}>
                        {toDateString(m.dateOfBirth)}:{' '}
                        {t('%{age} yo', { age: getAge(m.dateOfBirth, { at: new Date() }) })}
                      </Text>
                    </ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <Divider />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  labelContainer: {
    backgroundColor: '#ffffff',
    paddingLeft: Spacing.Medium,
    paddingRight: Spacing.Medium,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80
  },
  label: {
    fontSize: FontSize.Large
  },
  membersContainer: {
    flexGrow: 1
  },
  memberListItem: {
    padding: Spacing.XSmall
  },
  memberName: {
    marginBottom: Spacing.XSmall
  },
  memberNameText: {},
  memberSubtitleText: {
    fontSize: FontSize.Small
  }
});
