import { useAppConfig } from '@hpapp/features/app/settings';
import { AuthFirebaseLoginContainer, AuthLocalLoginContainer } from '@hpapp/features/auth';
import { useAssets } from 'expo-asset';
import { View, StyleSheet, Image } from 'react-native';

export default function AppRootGuest() {
  const appConfig = useAppConfig();
  const LoginContainer = appConfig.useLocalAuth ? AuthLocalLoginContainer : AuthFirebaseLoginContainer;
  const [loaded] = useAssets([require('assets/icon.png'), require('assets/splash.png')]);
  if (!loaded) {
    return <></>;
  }
  const icon = loaded[0];
  return (
    <View testID="AppRootGuest" style={styles.wrapper}>
      <View style={styles.container}>
        <Image
          source={{
            uri: icon.localUri ?? icon.uri,
            height: icon.height!,
            width: icon.width!
          }}
          style={styles.img}
          resizeMode="contain"
        />
        <LoginContainer />
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
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  img: {
    width: '80%',
    height: '40%'
  }
});
