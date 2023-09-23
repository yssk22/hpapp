# リポジトリ構成

## assets

こちらはアセットとして利用する画像やテキストファイルなどを配置します。すべてのアセットはビルドの対象としてバイナリに含まれるので、機密情報を含むデータファイルはこのディレクトリにいれてはいけません。

## contexts

`React.useContext` を使用した機能を作る場合は各コンテキスト単位で contexts ディレクトリを次の様に構成します。

```
contexts/
  {contextname}/
    index.tsx
    index.test.tsx
```

コンテキストを利用する場合は

```
import { createContext, useContextName } from '@hpapp/contexts/ContextName'
```

のようなフォーマットにします。

## features

各機能単位で features ディレクトリを次の様に構成します。

```
features/
  {featurename}/
    components/
    hooks/
    tests/
```

## import でのパスの指定

hpapp では `import` 文でリポジトリ内ので

# 開発環境

開発環境は Go と同じ devcontainer 内で実行します。このドキュメントのあるディレクトリから `yarn start` を行うだけで、React Native 用の JavaScript Bundle を配信する Metro Server が起動します。 Expo Go のクライアントもしくは開発用にビルドしたクラインとでこのサーバーに接続することで開発中のソースコードを即時ビルドして確認が行えます。

UI の開発を行う場合、

1. Expo Go アプリを使うのか、ビルドした IPA または APK を使うのか
2. 実機を使うか Android Emurator/iOS Simurator を使うのか

の 4 パターンの選択肢があります。状況に応じて使い分けられますが、いくつか注意点があります。

- 実機で行う場合、比較的高速に動作します。パフォーマンスに関連する問題に取り組むときは実機でのテストを行います。
- Expo Go での開発を行う場合、Firebase Analytics など一部のコンポーネントが動作しません。ですので、このようなコンポーネントを含む機能を開発する場合は interface を定義し、トップレベルで Dependency Injectioin を行えるような実装にすることが重要です。
- Emurator / Simurator を使う場合も同様に、Push Notification などの一部のコンポーネントが動作しません。

下記のモジュールを使う場合は Expo Go でのビルドは利用できません。

- features/auth/firebase パッケージ
- contexts/analytiscs/firebase パッケージ

## 開発環境のネットワーク構成

クライアントの端末は実機にしろ Emurator/Simurator にしろ、GraphQL のエンドポイントにアクセスできる必要があります。したがって、次の様な通信が発生します

```
Client --(LAN)--> Docker Host--(port foward)--> Metro Server
```

つまりクライアントは devcontaier 内の Docker の Host にアクセスできる必要があります。これには二つの設定が必要です。

1. Metro Server 自体はデフォルトで全てのネットワークインターフェースで listen しますが、自身が Docker Host からアクセスされることを知りません。また、 Docker Host が LAN 内でどのような IP アドレスを持っているのかも分かりません。そこで、開発者は `REACT_NATIVE_PACKAGER_HOSTNAME` 環境変数を通じて LAN 上の Docker Host の IP アドレスを教えてあげる必要があります。
2. devcontainer は 19000 ポートを Port Forwarding するように構成されているので、Docker はデフォルトの構成のままで構いません。一方で、Windows や Mac OS でファイアウォールなどの機能が動作している場合は 19000 ポートを開放するようにしておく必要があります。

この構成を意識したうえで、起動するときには REACT_NATIVE_PACKAGER_HOSTNAME 環境変数を与えることでクライアントからアクセスできるようになります。

```
$ REACT_NATIVE_PACKAGER_HOSTNAME=192.168.1.66 yarn start
```

もしうまく動かない場合は、`yarn start --tunnel` のように `--tunnel` 引数をつけて実行する場合 `ngrok` を使ったトンネルを構成する方法を試すこともできます。

また、この REACT_NATIVE_PACKAGE_HOSTNAME の IP アドレスは、デフォルトでクライアントが接続する GraphQL のサーバーの IP アドレスとしても利用されます。

# 開発用 IPA/APK のビルド方法

hpapp は Expo の EAS サービスにより IPA/APK をビルドすることが可能です。ただしこれには、iOS もしくは Android の開発者アカウントに加えて [expo.dev](https://expo.dev) のアカウントが必要です。アカウントを取得したら、開発環境のターミナルで `expo login` を実行し、アカウントにログインした状態にしておきます。

## 最初の設定

`myconfig.example.js` を `myconfig.js` にコピーし必要な変更を加えます。まずは slug, ios.bundleIdentifier, android.package を設定してください。slug は Expo のサービスの中で一意である必要がありますので、 `app-helloproject-{github-account-name}` などを使うのがよいでしょう。また、 `ios.bundleIdentifier`, `android.package` も一意であることが推奨されますので、`app.helloproject.{github-account}` のような形式にします。

```js
module.exports = ({ config }) => {
  config.slug = "app-helloproject-yssk22";
  config.ios.bundleIdentifier = "app.helloproject.yssk22";
  config.android.package = "app.helloproject.yssk22";
  return config;
};
```

次に `yarn eas build --profile development --platform ios` を実行します。最初は slug に設定したプロジェクトが Expo 上に存在しないのでプロジェクトを作成するかどうかを聞かれますので、`Y` を入力しプロジェクトを作成します。

slug の文字列に問題がなければプロジェクトの作成自体は完了しますが、コマンド自体はエラーになります。

```shell
$ yarn build
Would you like to automatically create an EAS project for @yssk22/app-helloproject-yssk22? › (Y/n) ... yes

✔ Created @yssk22/app-helloproject-yssk22 on Expo

Warning: Your project uses dynamic app configuration, and the EAS project ID can't automatically be added to it.
https://docs.expo.dev/workflow/configuration/#dynamic-configuration-with-appconfigjs

To complete the setup process, set "extra.eas.projectId" in your app.config.js:

{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "aa2bfb84-cbdd-419c-9298-37d41a367e16"
      }
    }
  }
}

✖ Linking local project to EAS project aa2bfb84-cbdd-419c-9298-37d41a367e16
Cannot automatically write to dynamic config at: app.config.js
    Error: build command failed.
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

ここで `projectId` の値が分かったので、これを同じように myconfig.js に設定します。

```js
module.exports = ({ config }) => {
  config.slug = "app-helloproject-yssk22";
  config.ios.bundleIdentifier = "app.helloproject.yssk22";
  config.android.package = "app.helloproject.yssk22";
  config.extra.eas.projectId = "aa2bfb84-cbdd-419c-9298-37d41a367e16";
  return config;
};
```

これで準備は完了です。再び `yarneas build --profile development --platform ios` を実行すると、途中で Apple のアカウントにログインするように求められますが、そこでログインを行うと、Ad Hoc Distribution 用の証明書やプロビジョニングプロファイルの作成などをすべて Expo が行ってくれます。
