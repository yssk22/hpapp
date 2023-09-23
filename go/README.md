# Go のソースコード構成

## [foundation/\*](./foundation)

このディレクトリ以下には、Go 言語をより生産性にフォーカスして効率よく利用するためのライブラリが含まれます。

## [system/\*](./system)

このディレクトリはアプリケーションをシステム構成に依存する基盤ライブラリを提供します。各パッケージは、基盤に関するインターフェースおよびサポートされる環境での実装を提供しています。

- [system/clock](system/clock) - 時間に依存する操作を行う
- [system/context](system/context) - contex.Context 内の情報を管理する
- [system/database](system/database) - (リレーショナル)データベースに対する操作を行う
- [system/environment](system/environment) - システム環境を構成する
- [system/http](system/http) - 外部の HTTP エンドポイントに対する操作を行う
- [system/notificaiton](system/notification) - プッシュ通知を行う
- [system/settings](system/settings) - システム設定を構成する
- [system/slog](system/slog) - 構造化ロギングの出力を行う
- [system/storage](system/storage) - ストレージに関する操作を行う

## [service/\*](./service)

このディレクトリはアプリケーションをサービス API として公開するためのライブラリが含まれます。サービスの中にはサービス自身に API を提供するサービスと、ユーザーに提供するサービスの２種類があります。

### サービス自身に API を提供するサービス

- [service/bootstrap](service/bootstrap) - サービス用プロセスを起動するためのライブラリ
- [service/schema](service/schema), `service/ent`, `service/entutil` - サービスのデータを保存するデータベーススキーマおよびそのアクセス機能を提供する API。[entgo フレームワーク](https://entgo.io/) によって自動生成されます。
- [service/healthcheck](service/schema) - サービスの状態監視を行うための API
- [service/test](service/test) - サービスのテストを行うための API

### ユーザーに API を提供するサービス

- [service/helloproject/ameblo](service/ameblo) - アメーバブログに関する API
- [service/helloproject/ig](service/helloproject/ig) - インスタグラムに関する API
- [service/helloproject/youtube](service/helloproject/youtube) - Youtube に関する API
- [service/helloproject/tiktok](service/helloproject/tiktok) - tiktok に関する API
- [service/helloproject/elineupmall](service/helloproject/tiktok) - Elineummall に関する API

## [graphql/\*](./graphql)

このディレクトリにはアプリケーションを GraphQL として公開するためのライブラリが含まれます。基本的には go/service/\* のラッパーとしての機能のみを提供します。

## [devtool/generator](./devtool/generator)

このディレクトリにはソースコードを生成するためのツール群が含まれています。主に GraphQL の開発をコードドリブンで行うためのツールが含まれています。

## `cmd/*`

このディレクトリには、各種コマンドが実装されています。いずれも `go run ./cmd/{command}` で利用可能です。

- `cmd/admin` - 管理用コマンド
- `cmd/server` - GraphQL 等モバイルアプリケーション向け API を提供する HTTP サーバー
