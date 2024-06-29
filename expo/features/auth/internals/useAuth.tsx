import { useMutationPromise } from '@hpapp/features/common';
import { graphql } from 'react-relay';

import { useAuthAuthenticateMutation } from './__generated__/useAuthAuthenticateMutation.graphql';

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
  return useMutationPromise<useAuthAuthenticateMutation>(useAuthAuthenticateMutationGraphQL);
}
