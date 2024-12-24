# iOS/Android development

## Install development build

### for iOS

Scan the QR code below or open [iTunes Link](itms-services://?action=download-manifest;url=https://storage.googleapis.com/hpapp.yssk22.dev/hpapp-dev.plist) to install the development build.

![iOS QR code](https://storage.googleapis.com/hpapp.yssk22.dev/artifacts/QR-hpapp-dev.png)

### for Android

Scan the QR code below or open [iTunes Link](itms-services://?action=download-manifest;url=https://storage.googleapis.com/hpapp.yssk22.dev/hpapp-dev.plist) to install the development build.

![Android QR](https://storage.googleapis.com/hpapp.yssk22.dev/artifacts/QR-hpapp-android-dev.png)

## Start a development server

```bash
$ cloud_sql_proxy -instances=${GCP_PROJECT}:asia-northeast1:${GCP_DB}=tcp:3306
$ cd go
$ go run ./cmd/ --prod httpserver
```

## Start a metro bundler

```bash
$ cd expo
$ yarn install
$ export APP_CHECK_DEBUG_TOKEN=****
$ export GRAPHQL_ENDPOINT=http://{development_server}:8080
$ envsubst < ./.env > ./.env.local
$ yarn start
```

now you can launch the app on your device and connect to the metro bundler
