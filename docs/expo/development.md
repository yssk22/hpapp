# iOS/Android development

## Install development build

### for iOS

![iOS QR code](https://storage.googleapis.com/hpapp.yssk22.dev/artifacts/QR-hpapp-dev-ios.png)

### for Android

![Android QR](https://storage.googleapis.com/hpapp.yssk22.dev/artifacts/QR-hpapp-dev-android.png)

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
