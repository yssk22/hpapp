import { Platform } from "react-native";
import Constants from "expo-constants";
import * as Updates from "expo-updates";

const IsBeta = Constants.expoConfig?.extra?.isBeta ?? false;
const IsDev = __DEV__ || IsBeta;
const EASBuildVersion: string =
  Constants.expoConfig?.extra?.EASBuildVersion ?? "unknown";

const IOS_BUILD_NUMBER =
  Constants.expoConfig && Constants.expoConfig.ios
    ? Constants.expoConfig.ios.buildNumber
    : "ios-unknown";
const ANDROID_BUILD_NUMBER =
  Constants.expoConfig && Constants.expoConfig.ios
    ? Constants.expoConfig.ios.buildNumber
    : "android-unknown";
const AppName = Constants.expoConfig ? Constants.expoConfig.name : "hpapp";
const ApplicationVersion = Constants.expoConfig
  ? Constants.expoConfig.version
  : "unknown";

const BuildNumber =
  Platform.OS === "ios" ? IOS_BUILD_NUMBER : ANDROID_BUILD_NUMBER;
const ApplicationString = `${AppName} (v${ApplicationVersion}.${BuildNumber}/${Updates.channel})`;

export {
  IsDev,
  AppName,
  ApplicationVersion,
  BuildNumber,
  ApplicationString,
  IsBeta,
  EASBuildVersion,
};
