/* eslint-disable local-rules/no-translation-entry */
import { useThemeColor } from '@hpapp/features/app/theme';
import { HPFollowType, HPMember } from '@hpapp/features/app/user';
import { useUpsertFollow } from '@hpapp/features/artist';
import { Text } from '@hpapp/features/common';
import { IconSize, Spacing } from '@hpapp/features/common/constants';
import { ElineupMallItemCategory } from '@hpapp/features/elineupmall';
import { t } from '@hpapp/system/i18n';
import { Icon } from '@rneui/themed';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';

export type ElineupMallSettingsFollowingMemberCategoryButtonProps = {
  category: ElineupMallItemCategory;
  value?: HPFollowType;
  member: HPMember;
};

export default function ElineupMallSettingsFollowingMemberCategoryButton({
  category,
  value,
  member
}: ElineupMallSettingsFollowingMemberCategoryButtonProps) {
  const [upsert, isSaving] = useUpsertFollow();
  const isUnfollow = value === undefined || value === 'unknown' || value === 'unfollow';
  const nextValue: HPFollowType = isUnfollow ? 'follow' : value === 'follow' ? 'follow_with_notification' : 'unfollow';
  const [color, contrast] = useThemeColor('primary');
  const backgroundColor = isUnfollow ? contrast : color;
  const foregroundColor = isUnfollow ? color : contrast;
  return (
    <TouchableOpacity
      onPress={() => {
        upsert(member.id, member.myFollowStatus!.type, [{ category, followType: nextValue }]);
      }}
    >
      <Text style={[styles.container, { borderColor: foregroundColor, backgroundColor, color: foregroundColor }]}>
        {t(category)}
      </Text>
      {value === 'follow_with_notification' && !isSaving && (
        <View style={styles.notifIcon}>
          <Icon type="material-community" name="bell-check" size={IconSize.Small * 0.75} color={contrast} />
        </View>
      )}
      {isSaving && (
        <View style={styles.notifIcon}>
          <ActivityIndicator color={foregroundColor} size="small" />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: Spacing.Small,
    marginBottom: Spacing.Small,
    padding: Spacing.XSmall,
    borderWidth: 1,
    borderRadius: 4
  },
  notifIcon: {
    position: 'absolute'
  }
});
