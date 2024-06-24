import useAppConfig from '@hpapp/features/appconfig/useAppConfig';
import { User } from '@hpapp/features/auth';
import FirebaseLoginContainer from '@hpapp/features/auth/firebase/FirebaseLoginContainer';
import LocalLoginContainer from '@hpapp/features/auth/local/LocalLoginContainer';
import Text from '@hpapp/features/common/components/Text';
import AppUpdateBanner from '@hpapp/features/root/banner/AppUpdateBanner';
import { useAssets } from 'expo-asset';
import { View, StyleSheet, Image } from 'react-native';

export default function GuestRoot({ onAuthenticated }: { onAuthenticated: (user: User) => void }) {
  const appConfig = useAppConfig();
  const LoginContainer = appConfig.useLocalAuth ? LocalLoginContainer : FirebaseLoginContainer;
  const [loaded] = useAssets([require('@hpapp/assets/icon.png'), require('@hpapp/assets/splash.png')]);
  if (!loaded) {
    return <></>;
  }
  const icon = loaded[0];
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Image
          source={{
            uri: icon.uri!,
            height: icon.height!,
            width: icon.width!
          }}
          style={styles.img}
          resizeMode="contain"
        />
        <AppUpdateBanner />
        <View style={{ height: 20 }}>
          <Text>FOO</Text>
        </View>
        <LoginContainer onAuthenticated={onAuthenticated} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  img: {
    width: '80%',
    height: '40%'
  }
});
