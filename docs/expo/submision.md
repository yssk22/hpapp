# Submission

The submission has to be done via [Github Actions / EAS - submit](https://github.com/yssk22/hpapp/actions/workflows/eas-submission.yml). This doc describes how it works.

## App Store Submission

Before submitting the app, you have to build the app with `prod` from [Github Actions / EAS - build](https://github.com/yssk22/hpapp/actions/workflows/eas-build.yml). Once done, you'll have the latest build on EAS.

[Github Actions / EAS - submit](https://github.com/yssk22/hpapp/actions/workflows/eas-submission.yml) simply do as follows:

1. generate `config/prod/AppStoreKey.p8` from `APPLE_APP_STORE_KEY_P8` secret stored in this reporsitroy.

This is the p8 file fetched from App Store Connect.

2. generate `eas.json` from `EAS_JSON` secret stored in this reporsitroy.

This is the eas.json file with `submit` configuration as follows.

```json
{
  "cli": {
    "version": "5.4.0"
  },
  "submit": {
    "prod": {
      "ios": {
        "ascAppId": "{app_id}}",
        "appleTeamId": "{team_id}",
        "ascApiKeyId": "{api_key}",
        "ascApiKeyIssuerId": "{api_key_issuer_id}",
        "ascApiKeyPath": "./config/prod/AppStoreKey.p8",
        "sku": "dev.yssk22.hpapp",
        "language": "ja-JP"
      },
      "android": {
        "serviceAccountKeyPath": "./config/prod/PlayStoreKey.json"
      }
    }
  }
}
```

3. `yarn eas submit --platform ios --profile prod --latest --non-interactive`

This command uses EXPO_APPLE_APP_SPECIFIC_PASSWORD secret in this repository though environment variable to authenticate with App Store Connect.
