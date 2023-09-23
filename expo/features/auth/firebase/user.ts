import auth from "@react-native-firebase/auth";

async function getToken() {
  return auth().currentUser?.getIdToken();
}

export { getToken };
