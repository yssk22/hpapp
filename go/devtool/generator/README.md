# Generator

Generator は各種フレームワーク用の Go のコードを生成するためのツールです。現状 Ent および gqlgen のフレームワークを用いているため、それらに対応するコードの生成をサポートします。

## Enum

Go では標準で Enum を定義する文法がありません。一方で、Ent や GraphQL は Enum を定数の集合として扱います。Enum を定義するためには、string などの基本型に対して Enum の型を定義し、`{Enum型の名前}{"Value"} = Value` のフォーマットで定数を定義します。

次の例は、 EnumType という名前の Enum の定義で、値として A", "B", "C" を持つ Enum を定義しています。

```go
type EnumType string

const (
    EnumTypeA EnumType = "A"
    EnumTypeB EnumType = "B"
    EnumTypeC EnumType = "C"
)
```

一方、Ent では `func(EnumType) Values() string` を定義する必要があります。また gqlgen では `MarshalGQL(io.Writer)` と `UnmarshalGQL(interface{})` をそれぞれ定義する必要があります。そこで、 Enum の Generator は、パッケージから、上記の規則に従った Enum を探し出し、それらについて Ent および gqlgen で Enum として取り扱うための関数を生成します。

## GraphQL

GraphQL の Generator は、Go の構造体から 1) GraphQL のスキーマ 2) gqlgen に対応した resolver.go を生成します。

### GraphQL のスキーマ

```go
type Query struct {
    MethodA(context.Context) Node1, error
    MethodB(context.Context, param Param) Node2, error
}
```

のようなトップレベルの `Query` 構造体が定義されていた場合に構造体の定義を解析し、Export されているすべての依存関係を GraphQL のスキーマとして出力します。

```graphql
type Query goModel(model: "path/to/package.Query") {
    methodA: Node1!
    methodB(param: Param!): Node2!
}

type Node1 goModel(model: "path/to/package.Node1") {
   ...
}

input ParamInput goModel(model: "path/to/package.Node1") {
  ...
}

type Node2 goModel(model: "path/to/package.Node1") {
  ...
}
```

また、依存関係の解析の際に、いくつかのルールを設けています。

- string 型で `ID` という名前のフィールドが見つかった場合は GraphQL 上で ID 型とする
- string 型を返す `ID()` という名前の関数が見つかった場合は GraphQL 上で ID 型とする
- 各関数の第１引数が `context.Context` である場合は、GraphQL 上では第１引数を省略する
- `func F() (T, error) `という関数が見つかった場合は、GraphQL 上では `F: T!` とする
- `MarshalGQL(io.Writer)` と `UnmarshalGQL(interface{})` を持つ構造体 T は GraphQL 上で `scalar T` とする
- `implements(InterfaceA)` というエクスポートされない関数を実装する構造体 T は `type T implements Interface` とし、InterfaceA の定義も `interface InterfaceA` とする
  - Go では明示的に implements を宣言する必要はないが、GraphQL では implements を宣言する必要があるため

### gqlgen に対応した resolver.go

上記のルールで生成された GraphQL のスキーマであれば、スキーマで定義されている type および scalar がすべて明示的に @goModel ディレクティブによってマッピングされるので resolver.go は非常にシンプルになります。

```go
type Resolver struct{}

var query = &models.Query{}

func (r *Resolver) Query() QueryResolver { return query }

var mutation = &models.Mutation{}

func (r *Resolver) Mutation() MutationResolver { return mutation }
```

尚、resolver.go は、gqlgen での cyclic import を防ぐため、スキーマ生成に利用したパッケージとは別のディレクトリに生成する必要があります。

## gqlgen の利用

gqlgen を使う場合次の様なファイル構成になります。

```
path/to/package
  query.go            // アプリケーションで実装
  mutation.go         // アプリケーションで実装
  gqlgen.graphql      // アプリケーションで実装
  gqlgen.yml          // アプリケーションで実装
  schema.graphql      // hpapp により生成
  gqlgen/
    resolver.go       // hpapp により生成
    exec_generated.go // gqlgen により生成
```

### gqlgen.graphql

このファイルには、gqlgen およびアプリケーションが使う GraphQL のスキーマを定義しておきます。gqlgen は @goModel ディレクティブおよびいくつかの primitive scalar を必要とします。

```graphql
directive @goModel(
  model: String
  models: [String!]
) on OBJECT | INPUT_OBJECT | SCALAR | ENUM | INTERFACE | UNION

scalar Any
scalar Time
scalar Map
scalar Upload
```

### gqlgen.ml

gqlgen.yml には以下のように記述します。

```yaml
schema:
  - ./gqlgen.graphql
  - ./schema.graphql

exec:
  filename: ./gqlgen/exec_generated.go
  package: gqlgen

resolver:
  layout: single-file
  filename: ./gqlgen/resolver.go
  package: gqlgen

autobind:

models:
  ID:
    model:
      - github.com/99designs/gqlgen/graphql.ID
```

これらの定義を使って `go run github.com/99designs/gqlgen generate --config ./gqlgen.yml` を実行することで exec_generated.go が自動生成できます。
