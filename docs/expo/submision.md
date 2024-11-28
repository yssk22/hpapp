# Submission

The submission has to be done via [Github Actions / EAS - submit](https://github.com/yssk22/hpapp/actions/workflows/eas-submission.yml). This doc describes how it works.

## 1. Build the production app

Before submitting the app, you have to build the app with `prod` from [Github Actions / EAS - build](https://github.com/yssk22/hpapp/actions/workflows/eas-build.yml). Once done, you'll have the latest build on EAS.

[Github Actions / EAS - submit](https://github.com/yssk22/hpapp/actions/workflows/eas-submission.yml) simply do as follows:

1. generate `config/prod/AppStoreKey.p8` from `APPLE_APP_STORE_KEY_P8` secret stored in this reporsitroy.

This is the p8 file fetched from App Store Connect.

2. generate `eas.json` from `EAS_JSON` secret stored in this reporsitroy.

This is the eas.json file with `submit` configuration as follows.

```json
{
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

Once your submission is completed successfully, the app gets available via Testflight. Do test carefully before the submission.

## 2. Prepare screenshots.

Once your test is done, you now have to prepare screenshots for the app.

Download ]the mockup file](https://drive.google.com/file/d/1e1GQOTkazB1WE-dbJbU0Eogrb-vULb7Y/view), load it at [app-mockup](https://studio.app-mockup.com/), then customize the screenshots for your version, then export it.

## 3. Submit for review.

Now you are ready to submit the app for review. Here is a sample description for the submission.

```
Here are brief instructions to use the app.

[Sign-in]
When a reviewer launch the app, they will see the sign-in screen, which supports any apple account or gmail account including the account submitted in the app review form.

[Follow A Member]
Once they sign in the app for the first time, you'll see member list to select so please tap at least one of profile pictures so that you can follow that member to subscribe the feed on the main screen.

[Fan Club Information]
Once they sign in the app for the first time, you'll see the form to setup the credentials for fan club. Put "00000000" in "FC会員番号(ハロー！プロジェクト)" field, and "00000000" in "パスワード(ハロー！プロジェクト)" field, then the '保存' button so that you'll subscribe the demo data for fan club

[Note]
For guideline 2.1, our app doesn't include any paid content, but can include information about paid events and items. These paid events / items are purchased outside our app at the following official sites

1) https://www.upfc.jp/helloproject/member_guide.php.
2) https://www.upfc.jp/m-line/member_guide.php
3) https://www.elineupmall.com/guide/

 Once a user purchase a membership of these sites, they can enter their credentials in our app to view the information, but our app don't provide a feature to purchase memberships, events or goods (just navigate the website to purchase). This feature is optional and users can opt-in by submitting their credentials.
```

- Note that the reviewer doesn't have UPFC account, so we have a demo mode for them to test UPFC features, otherwise they may reject the app for not being able to test the features, which violates Guideline 2.1.

## Appendix: Past Review Rejections.

- v2.1.0
  - `Your app's permissions requests are written in English while the app is set to the Japanese localization`.
    - app.config.js has to have locales settings to show localized string [[commit](https://github.com/yssk22/hpapp/commit/57c8ade9b12811082357450be480f2ecfe61b7b5)].
  - `Apps that support account creation must also offer account deletion to give App Store users more control of the data they've shared while using your app.`
    - App has to have a feature to delete the account [[commit](https://github.com/yssk22/hpapp/commit/9e4d846a3dc4deed196c7982447e58e5dced1f5e)]
