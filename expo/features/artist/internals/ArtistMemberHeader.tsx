import { HPMember } from '@hpapp/features/app/user';
import { Text } from '@hpapp/features/common';
import { Spacing } from '@hpapp/features/common/constants';
import { getAge, getToday, parseDate, toDateString } from '@hpapp/foundation/date';
import { t } from '@hpapp/system/i18n';
import { StyleSheet, View } from 'react-native';

import ArtistMemberFollowButton from './ArtistMemberFollowButton';
import ArtistMemberIcon, { ArtistMemberIconSize } from './ArtistMemberIcon';

export type ArtistMemberHeaderProps = {
  member: HPMember;
};

export default function ArtistMemberHeader({ member }: ArtistMemberHeaderProps) {
  const days = (getToday().getTime() - parseDate(member.joinAt).getTime()) / (1000 * 60 * 60 * 24);
  const age = getAge(member.dateOfBirth, { at: getToday() });
  return (
    <View style={styles.containerRow}>
      <View style={styles.memberThumbnailColumn}>
        <ArtistMemberIcon memberId={member.id} size={ArtistMemberIconSize.Large} circle />
      </View>
      <View style={styles.memberInfoColumn}>
        <View style={styles.memberInfoRow}>
          <Text style={styles.memberInfoLabel}>{t('dateOfBirth')}</Text>
          <Text style={styles.memberInfoDateValue}>{toDateString(member.dateOfBirth)}</Text>
          <Text style={styles.memberInfoDateAppendix}>
            ({age}
            {t('yearsold')})
          </Text>
        </View>
        <View style={styles.memberInfoRow}>
          <Text style={styles.memberInfoLabel}> {t('joinAt')}</Text>
          <Text style={styles.memberInfoDateValue}>{toDateString(member.joinAt)}</Text>
          <Text style={styles.memberInfoDateAppendix}>
            ({days}
            {t('days')})
          </Text>
        </View>
        <View style={styles.memberInfoFollowButtonContainer}>
          <ArtistMemberFollowButton member={member} />
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
  memberThumbnailColumn: {
    width: ArtistMemberIconSize.Large
  },
  memberInfoColumn: {
    flexGrow: 1,
    marginLeft: Spacing.Medium,
    justifyContent: 'flex-end'
  },
  memberInfoRow: {
    paddingTop: Spacing.XXSmall,
    paddingBottom: Spacing.XXSmall,
    flexDirection: 'row'
  },
  memberInfoLabel: {
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
