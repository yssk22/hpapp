# hpapp

happ repostiry is the Open Source Software version of Hello!Fan app for community members to contribute the software.

## Proprietry Version of Software

- [iOS](https://apps.apple.com/pl/app/%E3%83%8F%E3%83%AD%E3%83%BC-%E3%83%95%E3%82%A1%E3%83%B3/id1498031184)
- [Android](https://play.google.com/store/apps/details?id=dev.yssk22.hpapp)

## Other Resources

- [@hellofanapp on Twitter](https://twitter.com/hellofanapp)

## Setup Development Environment

- Use vscode and install [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension and it's prerequisits.
- Command Palette -> [Dev Containers: Clone Repostitory In Container Volume]
- Clone https://github.com/yssk22/hpapp
- Open default.code-workspace

### Run Go Server

```
$ cd go/
$ go run ./cmd/server/main.go
```

### Run Expo app

```
$ cd expo/
$ yarn install
$ yarn start
```

You can now scan QR code on the terminal to launch the app with Expo Go.
