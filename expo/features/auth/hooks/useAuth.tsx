import { useAuthAuthenticateMutation } from '@hpapp/features/auth/hooks/__generated__/useAuthAuthenticateMutation.graphql';
import { usePromisifyMutation } from '@hpapp/features/common/hooks/promisify';
import { graphql } from 'react-relay';

const useAuthAuthenticateMutationGraphQL = graphql`
  mutation useAuthAuthenticateMutation {
    authenticate {
      id
      accessToken
      username
    }
  }
`;

export default function useAuth() {
  return usePromisifyMutation<useAuthAuthenticateMutation>(useAuthAuthenticateMutationGraphQL);
}
