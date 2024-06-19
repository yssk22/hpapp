import FirebaseLoginContainer from '@hpapp/features/auth/firebase/FirebaseLoginContainer';
import useFirebaseTokensInHttpHeader from '@hpapp/features/auth/firebase/useFirebaseTokensInHttpHeader';
import LocalLoginContainer from '@hpapp/features/auth/local/LocalLoginContainer';
import Constants from 'expo-constants';

import Root from './features/root';
import screens from './generated/Screens';

export default function App() {
  const headerFn = useFirebaseTokensInHttpHeader();
  // useLocalLogin when the app use localhost:8080 for GraphQL and useFirebaseLogin is not set.
  const useLocalLogin =
    (Constants.expoConfig?.extra?.hpapp?.graphQLEndpoint as string).startsWith('http://localhost:8080/graphql/v3') &&
    Constants.expoConfig?.extra?.hpapp.useLogalLogin === true;
  if (useLocalLogin) {
    return <Root loginContainer={LocalLoginContainer} screens={screens} />;
  }
  // for production build
  return (
    <Root
      loginContainer={FirebaseLoginContainer}
      httpClientConfig={{
        NetworkTimeoutSecond: 60,
        ExtraHeaderFn: headerFn
      }}
      screens={screens}
    />
  );
}
