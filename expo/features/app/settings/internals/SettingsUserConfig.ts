import { SettingsStore, AsyncStorage } from '@hpapp/system/kvs';
import { ThemeColorKey } from '@hpapp/system/theme';

export type UserConfig = {
  completeOnboarding?: boolean;

  themeColorKeyPrimary: ThemeColorKey;
  themeColorKeySecondary: ThemeColorKey;
  themeColorKeyBackground: ThemeColorKey;

  consentOnPrivacy?: boolean;
  consentOnToS?: boolean;
  consentOnUPFCDataPolicy?: boolean;

  amebloOptimizedView: boolean;
  feedUseMemberTaggings: boolean;

  adminEnableDevOnly: boolean;
};

export const SettingsUserConfigDefault: UserConfig = {
  completeOnboarding: false,
  themeColorKeyPrimary: 'hpofficial',
  themeColorKeySecondary: 'hotpink',
  themeColorKeyBackground: 'white',
  consentOnPrivacy: false,
  consentOnToS: false,
  consentOnUPFCDataPolicy: false,

  amebloOptimizedView: false,
  feedUseMemberTaggings: true,

  adminEnableDevOnly: false
};

export default SettingsStore.register<UserConfig>(
  // we keep the legacy format of the setings key
  'hpapp.settings.user_config',
  new AsyncStorage(),
  {
    defaultValue: SettingsUserConfigDefault
  }
);

// export default function useLocalUserConfig() {
//   return useSettings(LocalUserConfigurationSettings);
// }

// export { LocalUserConfiguration, LocalUserConfigurationSettings };
