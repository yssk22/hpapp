# Build - iOS/Android development

You need a IPA/APK for development purpose (a.k.a adhoc build). This document describes how to build IPA/APK for development.

## Prerequisites

To build IPA/APK, you need to have the following accounts and projects and get familliar with them. This document don't show the basic procedure of these services.

- [expo.dev](https://expo.dev/) project
- [Firebase](https://firebase.google.com/) project

## Start to work on the expo directory

```shell
$ cd expo/
$ yarn install
$ yarn expo login
```

## Define your config name

**You can skip this step if you have access to Expo Project for [dev](https://expo.dev/accounts/yssk22/projects/hpapp).**

We use `yourconfig` in this doc as an example. We use `dev` in development build for repository owners, and use `prod` in production build. Open Source contributors need their own config name.

```shell
$ export HPAPP_CONFIG_NAME=yourconfig
$ cp -r ./config/dev ./config/$HPAPP_CONFIG_NAME
```

### app.config.js

Edit `./config/$HPAPP_CONFIG_NAME/app.config.js`. It's important to update the following configurations to adjust your Expo project.

- `config.slug` - your Expo project slug.
- `config.extra.eas.projectId` - your EAS project id.
- `config.ios.bundleIdentifier` - bundle identifier for iOS. should be `dev.yssk22.hpapp.{env}`.
- `config.android.package` - package name for Android. should be `dev.yssk22.hpapp.{env}.android`.
- `config.extra.hpapp.env` - environnment name. should be same as $HPAPP_CONFIG_NAME.
- `config.extra.hpapp.isBeta` - boolean value to indicate the build to be submitted to app store _review_ or not while the client is submitted to testflight.
- `config.extra.hpapp.isDev` - boolean value to indicate the development build or not.
- `config.extra.hpapp.firebaseIOSClientID` - The value should be same as `CLIENT_ID` in GoogleService-Info.plist
- `config.extra.hpapp.firebaseAndroidClientID` - The value should be same as `client_id` field in oauth_client where the pacakge name matches with `config.android.package` in google-services.json

### eas.json

Edit `./config/$HPAPP_CONFIG_NAME/eas.json`. You just need to replace `"dev"` with `${HPAPP_CONFIG_NAME}`

### Firebase configuration file

You need to obtain `GoogleService-Info.plist` and `google-services.json` from your Firebase project as described in [the Help Center article](https://support.google.com/firebase/answer/7015592).

Once you get these files, put them in `./config/$HPAPP_CONFIG_NAME/` directory and upload them as EAS credential.

```text
$ eas secret:create --scope project --name DEV_GOOGLE_SERVICES_JSON --type file --value ./config/dev/google-services.json
$ eas secret:create --scope project --name DEV_GOOGLE_SERVICES_INFO_PLIST --type file --value ./config/dev/GoogleService-Info.plist
```

### Firebase AppCheck Configuration

If you use Firebase Authentication with AppCheck, you need to configure AppCheck on your firebase project [[ref](https://firebase.google.com/docs/app-check/ios/devicecheck-provider?authuser=0&hl=ja)].

## Create a development build on EAS

It's now ready to kick the development build process.

```shell
$ ./scripts/eas-build-pre-install.sh
$ ./scripts/eas.sh build --profile ${HPAPP_CONFIG_NAME} --platform ios
```

The `./scripts/eas.sh` simply copy `eas.json` from the config directory to the root eas.json file and run `yarn eas`. For the very first build, you may need to setup project credentials such as Distribution Certificate, Provisioning Proile, Push Notification Key, ...etc. From the second build, you can add --non-interactive to skip the setup process.

Once the build is completed, you can download and install the build on your device.

## Starting a development build

when you develop the app inside your container while the development app is deployed on iOS/Android outside the container (e.g. physical deviecs),
your development build still need to connect react native packager to get the source code from your container. To do this, you need to set `REACT_NATIVE_PACKAGER_HOSTNAME`
so that your react native packager to bind with the address.

Note that your_container_address can be the same sa your host IP if you use the port forwarding in vscode Remote Container Development.

```shell
$ export REACT_NATIVE_PACKAGER_HOSTNAME={your_container_address}
```

Then you can start the devclient with the following command.

```shell
$ yarn start
```

Now it's time to launch your development build and connect your environment to test the app!
