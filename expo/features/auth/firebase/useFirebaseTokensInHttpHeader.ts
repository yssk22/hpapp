import Constants from "expo-constants";
import * as Device from "expo-device";
import { getToken as getClientToken } from "@hpapp/features/auth/firebase/appcheck";
import { getToken as getAuthToken } from "@hpapp/features/auth/firebase/user";

export default function useFirebaseTokensInHttpHeader() {
  return async (): Promise<Record<string, string>> => {
    const clientToken = (await getClientToken()).token;
    const authToken = await getAuthToken();
    return {
      "X-HPAPP-VERSION": Constants.expoConfig?.version || "",
      "X-HPAPP-EXPO-VERSION":
        Constants.expoConfig?.runtimeVersion?.toString() || "",
      "X-HPAPP-DEVICE-INFO": `${Device.modelName}/${Device.osName}/${Device.osVersion}`,
      "X-HPAPP-Client-Authorization": `Bearer ${clientToken}`,
      "X-HPAPP-3P-Authorization": `Bearer ${authToken}`,
    };
  };
}
