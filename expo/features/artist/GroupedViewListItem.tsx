import MemberIcon from '@hpapp/features/artist/MemberIcon';
import Text from '@hpapp/features/common/components/Text';
import { FontSize, MemberIconSize, Spacing } from '@hpapp/features/common/constants';
import { HPMember } from '@hpapp/features/root/protected/context';
import { toDateString, getAge } from '@hpapp/foundation/date';
import { t } from '@hpapp/system/i18n';
import { Divider, ListItem } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';

export default function GroupedViewListItem({ label, members }: { label: string; members: HPMember[] }) {
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
              <ListItem key={m.key} containerStyle={styles.memberListItem}>
                <MemberIcon member={m} size={MemberIconSize.Small} />
                <ListItem.Content>
                  <ListItem.Title style={styles.memberName}>
                    <Text style={styles.memberNameText}>{m.name}</Text>
                  </ListItem.Title>
                  <ListItem.Subtitle>
                    <Text style={styles.memberSubtitleText}>
                      {toDateString(m.dateOfBirth)}: {t('%{age} yo', { age: getAge(m.dateOfBirth) })}
                    </Text>
                  </ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
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
