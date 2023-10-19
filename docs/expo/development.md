# iOS/Android development

To develop iOS/Android applications, you need to have

- [expo.dev](https://expo.dev/) project
- [Firebase](https://firebase.google.com/) project

and get familiar with them. This document don't show the basic procedure of these services.

## Start to work on the expo directory

```
$ cd expo/
$ yarn install
$ yarn expo login
```

## Define your config name

We use `yourconfig` in this doc as an example. We use `dev` in development build for repository owners, and use `prod` in production build. Open Source contributors need their own config name.

```
$ export HPAPP_CONFIG_NAME=yourconfig
$ cp -r ./config/dev ./config/$HPAPP_CONFIG_NAME
```

## Update configuration

### app.config.js

Edit `./config/$HPAPP_CONFIG_NAME/app.config.js`. It's important to update the following configurations to adjust your EAS environment. You should have an Expo project at this stage.

- `config.slug`
- `config.extra.eas.projectId`
- `config.ios.bundleIdentifier`
- `config.android.package`

### eas.json

Edit `./config/$HPAPP_CONFIG_NAME/eas.json`. You just need to replace `"dev"` with `${HPAPP_CONFIG_NAME}`

## Put your secrets under your config directory

### Firebase configuration file

You need to obtain `GoogleService-Info.plist` and `google-service.json` from your Firebase project as described in [the Help Center article](https://support.google.com/firebase/answer/7015592).

Once you get these files, put them in `./config/$HPAPP_CONFIG_NAME/` directory and upload them as EAS credential.

```
$ yarn eas secret:create --scope project --name DEV_GOOGLE_SERVICES_JSON --type file --value ./config/dev/google-service.json
$ yarn eas secret:create --scope project --name DEV_GOOGLE_SERVICES_INFO_PLIST --type file --value ./config/dev/GoogleService-Info.plist
```

### secrets.json

`secrets.json` is a file to define application specific configuratons which we don't want to share with others. You need to put it under `./config/$HPAPP_CONFIG_NAME/secrets.json` as well. The file is something like that.

```
{
  "extra": {
    "hpapp": {
      "graphQLEndpoint": "https://your-graphql-endpoint",
      "auth": {
        "google": {
          "iosClientId": "your Firebase clientId for iOS",
          "androidClientId": "your Firebase clientId for iOS"
        }
      }
    }
  }
}
```

then upload it to the EAS server as a file secret.

```
$ yarn eas secret:create --scope project --name DEV_SECRETS_JSON --type file --value ./config/dev/secrets.json
```

## Create a development build on EAS

It's now ready to kick the development build process.

```
$ ./scripts/eas-build.sh
```

The script start the build proces only for iOS by default. If you want to build Android as well, you can use HPAPP_CONFIG_PLATFORM.

```
$ HPAPP_CONFIG_PLATFORM=android ./scripts/eas-build.sh
```

The script simply copy `eas.json` from the config directory and run `yarn eas build --profile ${HPAPP_CONFIG_NAME} --platform ${HPAPP_CONFIG_PLATFORM} --non-interactive` command.

Once the build is completed, you can download and install the build on your device.

## Starting a development build

when you develop the app inside your container while the development app is deployed on iOS/Android outside the container (e.g. physical deviecs),
your development build still need to connect react native packager to get the source code from your container. To do this, you need to set `REACT_NATIVE_PACKAGER_HOSTNAME`
so that your react native packager to bind with the address.

Note that your_container_address can be the same sa your host IP if you use the port forwarding in vscode Remote Container Development.

```
$ export REACT_NATIVE_PACKAGER_HOSTNAME={your_container_address}
```

Then you can start the devclient with the following command.

```
$ yarn start
```

Now it's time to launch your development build and connect your environment to test the app!

## Expo Go client to develop

This may or may not work.
