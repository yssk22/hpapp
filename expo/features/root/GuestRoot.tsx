import { LoginContainer, User } from '@hpapp/features/auth';
import { useAssets } from 'expo-asset';
import { View, StyleSheet, Image } from 'react-native';

export default function GuestRoot({
  LoginContainer,
  onAuthenticated
}: {
  LoginContainer: LoginContainer;
  onAuthenticated: (user: User) => void;
}) {
  const [loaded] = useAssets([require(`assets/icon.png`), require(`assets/splash.png`)]);
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
