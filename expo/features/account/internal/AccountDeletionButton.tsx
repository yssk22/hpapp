import { useLogout, useUserRoles } from '@hpapp/features/auth';
import { t } from '@hpapp/system/i18n';
import { Button } from '@rneui/themed';
import { useCallback } from 'react';
import { Alert } from 'react-native';
import Toast from 'react-native-root-toast';
import { graphql, useMutation } from 'react-relay';

import { AccountDeletionButtonDeleteAccountMutation } from './__generated__/AccountDeletionButtonDeleteAccountMutation.graphql';

const AccountDeletionButtonDeleteAccountMutationGraphQL = graphql`
  mutation AccountDeletionButtonDeleteAccountMutation {
    me {
      delete
    }
  }
`;

export default function AccountDeletionButton() {
  const [deleteAccount, isDeletingAccount] = useMutation<AccountDeletionButtonDeleteAccountMutation>(
    AccountDeletionButtonDeleteAccountMutationGraphQL
  );

  const logout = useLogout();
  const roles = useUserRoles();
  const onPress = useCallback(() => {
    Alert.alert(t('Delete Account'), t('Are you really ok to delete your account?'), [
      { text: t('Cancel'), style: 'cancel' },
      {
        text: t('OK'),
        style: 'destructive',
        onPress: () => {
          if (roles['admin']) {
            Toast.show('Cannot delete admin account', { duration: Toast.durations.LONG });
            logout();
            return;
          }
          deleteAccount({
            variables: {},
            onCompleted: (resp, err) => {
              if (resp.me?.delete === true) {
                logout();
              } else {
                Toast.show('something went wrong', { duration: Toast.durations.LONG });
              }
            }
          });
        }
      }
    ]);
  }, []);
  return (
    <Button type="solid" color="error" onPress={onPress} testID="AccountDeletionButton" disabled={isDeletingAccount}>
      {t('Delete Account')}
    </Button>
  );
}
