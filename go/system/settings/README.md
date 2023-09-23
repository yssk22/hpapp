# Settings

Settings は、サービスの設定を参照、更新するための機能を提供します。

# 設定値の定義

設定を定義するには `settings.New*()` 関数を用います。この関数を使って settings.Item インターフェースを持つオブジェクトをプログラムにロードします。

次の例は、`foo` というキーを持つ設定を定義する例です。設定がどこにも保存されて以内場合、`foo` を参照した場合は `"defalut_value"` を返す定義になります。

```go
var MySettings = settings.NewString("foo", "default_value")
```

設定のキーの命名規則は `service.{service_name}.{feature_name}.{function_name}` にすることを推奨しますが、この限りではありません。

# 設定値の参照

定義した設定値を参照するには `settings.Get(context.Context, settings.Item)` を呼び出すだけです。設定の保存先は context.Context に保存されている設定用のストアもしくはコンテキスト内にそれがない場合は環境変数を使用します。

```go
fooValue, err := settings.Get(ctx, MySettings)
```

設定が定義されていない場合は環境変数を参照します。環境変数はすべて大文字を使用します。上記の例では FOO という環境変数の値を参照することになります。

またコマンドラインでも設定値を確認できます。

```shell
$ go run ./cmd/admin/ settings get foo
```

# 設定値の更新

設定を更新する場合はコマンドラインを使います。

```shell
$ go run ./cmd/admin/ settings set foo newValue
```

デフォルトでは ./data/settings.json ファイルを設定の保存先として使用するため、このファイルが次の様に更新されます。

```json
{
  "foo": "newValue"
}
```

# 設定の一覧

設定の一覧を確認するにはコマンドラインを使います。

```shell
$ go run ./cmd/admin/ settings list
```

設定の一覧は `settings.New*` 関数を使ってパッケージスコープで定義されたもののみを表示します。このコマンドは、デフォルトで `helloproject.ap/go/` 以下の全てのパッケージをチェックするようになっていますので、設定はそれを最も利用するパッケージの内部に定義するようにします。

もしプログラム内でから設定の一覧を取得したい場合は `settings.CaptureSettings("pacakge_name")` を使うと`package_name`内に宣言されている設定について `settings.ItemInfo` のリストとして取得できます。
