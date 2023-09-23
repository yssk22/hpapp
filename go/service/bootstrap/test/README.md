# テストの実装

## アサーション

テストを実装する際は [hellproject.app/go/foundation/assert](/hpapp.yssk22.dev/gofoundation/assert/) パッケージを用いてアサーションを行います。よくある Boolean アサーション、Nil アサーション、等価アサーションに加えて、スナップショットアサーションを使うことができます。

### スナップショットアサーション

hpapp のテストではスナップショットテストの仕組みを導入しています。 オブジェクトスナップショットテストは、複雑なオブジェクト(例えば ent のレコードなど)をテストする際に、期待するデータ構造を外部のファイルとして保存しておくことでテストコードの記述を簡略化する仕組みです。

これを行うには 次の様に使います。

```go

import (
    "testing"
    "hellproject.app/go/foundation/assert"
)

func TestSomething(t *testing.T){
    a := assert.NewTestAssert(t)
    obj := createSomethingComplex()
    a.Snapshot("something", obj)
}
```

このコードでテストを実行すると、初回は、テストを実装したパッケージの `testdata/snapshot.something.json` というパスに `obj` を JSON フォーマットに変換したスナップショットファイルを保存します。初回のテスト実行時には、このファイルの内容について期待するデータになっているかの確認を行います。

次回以降は `a.Snapshot("something", obj)` が実行される際に、 `testdata/snashot.something.json` のファイルを先に読み取り、 `obj` と一致するかどうかをチェックし、一致しない場合はアサーションが失敗となります。アサーションが失敗した場合のメッセージには JSON の diff が含まれています。

```shell
TODO: Fail メッセージ
```

### Tips

アサーション失敗のメッセージが大きくなりすぎる場合は、一度、 `testdata/snashot.something.json` を削除し、テストを実行してスナップショットファイルを再生成することで vscode の git diff ビューアーにて変更された内容について詳細に確認することができます。変更が意図したものであればそのままファイルをコミットし、そうでなければ、変更が意図したとおりになるようにコードを修正します。Pull Request でスナップショットファイルの変更がある場合には、変更に伴う影響範囲を注意深くレビューしてください。

一部のデータについては、自動生成されるために、毎回スナップショットファイルが変更される可能性があります。この場合は、`assert.Snapshot` 関数に対してスナップショットファイルに含めないフィールドを指定することでアサーションの失敗を回避できることがあります。

```go
	a.Snapshot(
		"obj", obj,
		assert.SnapshotExclude("dynamic_field1"),
		assert.SnapshotExclude("dynamic_field2"),
	)
```

## サービステスト実装時の外部リソースの利用

service ディレクトリ以下のテスト実装では、 `hpapp.yssk22.dev/goservice/test` パッケージを使うことでテスト用に構成された外部リソース(データベース、ログ出力ストリーム、設定用 KVS 等)を使ったインテグレーションテストを実装することができます。

```go
import (
    "testing"
    "hpapp.yssk22.dev/goservice/test"
)

func TestServiceIntegration(t *testing.T) {
    test.New("my test").Run(t, func(ctx context.Context, t *testing.T) {
        // ....
    })
}
```

`test.New("test name")` のインスタンス毎に固有の外部リソースが構成されるので、あるテストケースで作成したデータベースのレコードは、別のテストケースには影響しません。また、`HPArtist`, `HPAsset`, `HPMember` の各エンティティは `WithHPMaster` をつけることで、テストケース単位で自動的にデータベースにセットアップすることができます。このデータはリポジトリ内の go/data/\*.csv に基づいて作成されています。

```go
func TestServiceIntegration(t *testing.T) {
    test.New("my test", test.WithMaster()).Run(t, func(ctx context.Context, t *testing.T) {
        // ....
        // entclient := entutil.NewClient(ctx)
        // entclient.HPArtist.Query().All(ctx) --> go/data/hp_artists.csv からインポートされたレコードを返す
    })
}
```
