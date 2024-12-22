# Submission

The submission can be done as a part of Build workflow in Github Action ([Android](https://github.com/yssk22/hpapp/actions/workflows/eas-build-android.yml), [ioS](https://github.com/yssk22/hpapp/actions/workflows/eas-build-ios.yml)). What you need to setup for the submission are:

- config/eas.json
- config/AppStoreKey.p8
- config/PlayStoreKey.json

Those files are generated via environment secrets. So once you get the files, you can configure environment secrets.

- `EAS_SUBMIT` generates ./config/eas.json
- `APP_STORE_KEY` generates ./config/AppStoreKey.p8
- `PLAY_STORE_KEY` generates ./config/AppStoreKey.p8

## EAS_SUBMIT

This environment secret is a eas.json file only for submission, not build and should be the following format.

```
{
  "submit": {
    "prod": {
      "ios": {
        "appleTeamId": "{team_id}",
        "appleId": "{apple_id}",
        "ascAppId": "{app_id}",
        "ascApiKeyId": "{api_key}",
        "ascApiKeyIssuerId": "{api_key_issuer_id}",
        "ascApiKeyPath": "./config/AppStoreKey.p8",
        "sku": "dev.yssk22.hpapp",
        "language": "ja-JP"
      },
      "android": {
        "track": "internal",
        "releaseStatus": "draft",
        "serviceAccountKeyPath": "./config/PlayStoreKey.json"
      }
    }
  }
}
```

## Screenshots.

Once your test is done, you now have to prepare screenshots for the app.

Download ]the mockup file](https://drive.google.com/file/d/1e1GQOTkazB1WE-dbJbU0Eogrb-vULb7Y/view), load it at [app-mockup](https://studio.app-mockup.com/), then customize the screenshots for your version, then export it.

## 3. Submit for review (iOS)

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
