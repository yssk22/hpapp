import { useMemberMap, useReloadUserContext } from '@hpapp/features/app/user';
import { Spacing } from '@hpapp/features/common/constants';
import { t } from '@hpapp/system/i18n';
import { Button } from '@rneui/themed';
import { useCallback, useMemo } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { graphql, useMutation } from 'react-relay';

import HPSortResultListView from '../HPSortResultListView';
import { HPSortNewResultSaveMutation } from './__generated__/HPSortNewResultSaveMutation.graphql';
import { HPSortMemberNode } from './types';
import HPSortBase from '../sort/HPSortBase';

const HPSortNewResultSaveMutationGraphQL = graphql`
  mutation HPSortNewResultSaveMutation($input: HPSortHistoryCreateParamsInput!) {
    me {
      createSortHistory(params: $input) {
        id
        createdAt
        sortResult {
          records {
            artistId
            memberId
            memberKey
            rank
          }
        }
      }
    }
  }
`;

export type HPSortNewResultProps = {
  sorter: HPSortBase<HPSortMemberNode>;
  onRetryPress: () => void;
  onSave: () => void;
};

export default function HPSortNewResult({ sorter, onRetryPress, onSave }: HPSortNewResultProps) {
  const [save, isSaving] = useMutation<HPSortNewResultSaveMutation>(HPSortNewResultSaveMutationGraphQL);
  const [reload, isReloading] = useReloadUserContext();
  const memberMap = useMemberMap();
  const result = useMemo(() => {
    return sorter.getResult().map((v) => {
      return {
        memberId: v.value.member.id,
        rank: v.rank
      };
    });
  }, [sorter]);
  const onSaveButtonPress = useCallback(() => {
    save({
      variables: {
        input: {
          records: result.map((v) => {
            const member = memberMap.get(v.memberId)!;
            return {
              ...v,
              artistId: parseInt(member.artistID!, 10),
              artistKey: member.artistKey,
              memberId: parseInt(member.id, 10),
              memberKey: member.key,
              rank: v.rank
            };
          })
        }
      },
      onCompleted: () => {
        reload();
        onSave();
      }
    });
  }, [sorter]);
  return (
    <View style={styles.container}>
      <ScrollView>
        <HPSortResultListView list={result} />
      </ScrollView>
      <View style={styles.buttonGroup}>
        <Button containerStyle={styles.button} type="outline" onPress={onRetryPress} disabled={isSaving || isReloading}>
          {t('Retry')}
        </Button>
        <Button containerStyle={styles.button} disabled={isSaving || isReloading} onPress={onSaveButtonPress}>
          {t('Save')}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  buttonGroup: {
    marginTop: Spacing.Small,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  button: {
    flexGrow: 1,
    paddingLeft: Spacing.Small,
    paddingRight: Spacing.Small
  }
});
