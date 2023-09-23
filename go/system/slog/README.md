# slog パッケージでのロギング

hpapp では [github.com/yssk22/hpapp/gosystem/slog](github.com/yssk22/hpapp/gosystem/slog) パッケージを使って構造化ログを出力します。構造化ログは必ず message フィールドを持ち、必要に応じてその他の構造化されたデータを追加することができます。slog パッケージは system および service を実装するときにのみ利用し、 foundation を実装する際には利用しないでください。

## `slog.Name(string)`

ログエントリに対してログの特定に使用するキーを設定します。 次の様なネーミングルールを推奨していますがこれに限りません。

- `system.{system_name}.{feature_name}.{function_name}`
- `service.{service_name}.{feature_name}.{function_name}`

プロダクション環境ではログに基づくメトリックスの集計を行いますので、名前を変更する場合は注意してください。

## `slog.Attriute(string, interface{})`

ログエントリに対してログに付与する構造化データをキーバリュー形式で追加します。

## 自動的に収集される構造化データ

次のデータは自動的に収集されます。

- ソースコードのパス、行数
- ロギングを実行時点のスタックトレース

また次のデータは必要に応じて収集されます。

- ロギングを実行時点のスタックトレース
- コンテキストのデータ (実行コンテキストを特定するための ID など)

## ログの出力先

ログの出力先は `slog.Sink` インターフェースとして実装されている必要があります。

- `NewNullSink()`: ログを一切出力しない
- `NewMemorySink([]Record)`: ログ出力を `[]Record` に行う (ログ出力をテストしたいときに用いる)
- `NewIOSink(io.Writer, Formtter)`: ログ出力を `io.Writer` に対して行う。Formatter インターフェースを渡すことでフォーマットをカスタマイズする。
  - `JSONLFormatter`: JSONL 形式でログを出力する。
  - `JSONFormatter`: "%s [{Timestsamp}] [{Severity}] {Message} (at {SourcePath}:{SourceLine}) {Attribute}" 形式で出力する。
  - `SimpleFormatter`: "%s [{Timestsamp}] [{Severity}] {Message} (at {SourcePath}:{SourceLine})" 形式で出力する。
