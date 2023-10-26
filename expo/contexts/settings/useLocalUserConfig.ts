import { useSettings } from "@hpapp/contexts/settings";
import { ColorKey } from "./theme";
import { SettingsStore, AsyncStorage } from "@hpapp/system/kvs";

type LocalUserConfiguration = {
  completeOnboarding?: boolean;
  themePrimaryColorKey?: ColorKey;
  themeSecondaryColorKey?: ColorKey;
  themeBackgroundColorKey?: ColorKey;
  consentOnPrivacy?: boolean;
  consentOnToS?: boolean;
  consentOnUPFCDataPolicy?: boolean;

  amebloOptimizedView: boolean;
  feedUseMemberTaggings: boolean;

  adminEnableDevOnly: boolean;
};

const LocalUserConfigurationSettings =
  SettingsStore.register<LocalUserConfiguration>(
    // we keep the legacy format of the setings key
    "hpapp.user.local_user_config",
    new AsyncStorage(),
    {
      defaultValue: {
        completeOnboarding: false,
        themePrimaryColorKey: "hpofficial",
        themeSecondaryColorKey: "hotpink",
        themeBackgroundColorKey: "white",
        consentOnPrivacy: false,
        consentOnToS: false,
        consentOnUPFCDataPolicy: false,

        amebloOptimizedView: false,
        feedUseMemberTaggings: true,

        adminEnableDevOnly: false,
      },
    }
  );

export default function useLocalUserConfig() {
  return useSettings(LocalUserConfigurationSettings);
}

export { LocalUserConfiguration, LocalUserConfigurationSettings };
