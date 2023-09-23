# データベース

hpapp ではデータベースに RDB を採用しています。 `github.com/yssk22/hpapp/go/system/database` パッケージはデータベース接続のみを提供し、実際のクエリは ent フレームワークによって `github.com/yssk22/hpapp/go/service/ent` パッケージに実装されています。このパッケージは ent フレームワークにより `github.com/yssk22/hpapp/go/service/schema` から自動生成されます。

## ent フレームワークを利用したデータアクセス

service の実装では ent フレームワークを使ってデータベースにアクセスします。例えばすべてのアーティスト情報を取得するには下記の様に行います。 `entutil.NewClient(ctx)` は必要なタイミングで呼び出して構いません。データベースの接続は \*sql.DB によってコンテクションプールの管理が行われています。

```go
func DoSomething(ctx context.Context) {
    entclient := entutil.NewClient(ctx)
    artists, err := entclient.HPArtist.Query().All(ctx)
    if err != ni {
        panic(err)
    }
    // do something on artits
}
```

## GraphQL への公開

ent で定義されたデータベースのレコードは、GraphQL への公開方法を検討する必要があります。

### テーブルレベルでの公開制御

各スキーマにて `Annotation()` を用いて GraphQL への公開方法を定義します。次の書式で MyEnt は全てのフィールドが GraphQL スキーマにも定義され公開されます。

```go
func (MyEnt) Annotations() []schema.Annotation {
	return []schema.Annotation{}
}
```

公開を停止するには entgql.Skip() を指定します。

```go
func (MyEnt) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entgql.Skip(entgql.SkipAll),
    }
}
```

### フィールドレベルでの公開制御

テーブルレベルでの公開制御と同じように、フィールドレベルでも制御が可能です。例えば次の例は、expire_at フィールドを GraphQL で公開しないようにします。

```go
		field.Time("expire_at").Optional().Comment("token expire").Annotations(
			entgql.Skip(entgql.SkipAll),
		),
```

## 公開された ent のアクセス制御

公開された ent は原則 ID が分かれば誰でもアクセス可能な状態になります。これは、GraphQL が Relay の 仕様に準拠して、 Query.node(id: ID!) という形でアクセスが可能なためです。このため、GraphQL で公開される Ent は必ずアクセス制御のポリシーを検討してください。

例えば、ent.User はアプリケーションのアクセストークンを保持するものです。ですので、自分のレコード以外はアクセスを許可するべきではありません。ent の Privacy Rule でこれを実装するには「User クエリに対して必ず `id ="{現在のUserID}"` の Where 句が入るようにすることです。これは `privacy.FilterFunc` を利用して実装します。

```go
func (User) Policy() ent.Policy {
	return privacy.Policy{
		Query: privacy.QueryPolicy{
			auth.AlloIfAdmin(),
			privacy.FilterFunc(func(ctx context.Context, f privacy.Filter) error {
				uid, err := strconv.Atoi(auth.CurrentUser(ctx).ID())
				if err != nil {
					return privacy.Denyf("invalid uid")
				}
				af, ok := f.(*myent.UserFilter)
				if !ok {
					return errors.Wrap(ctx, fmt.Errorf("invalid filter applied: %#v", f))
				}
				af.WhereID(entql.IntEQ(uid))
				return privacy.Skip
			}),
		},
	}
}
```

また、例えば、ent.Auth は ent.User が保有する外部認証情報を保持するレコードですが、こちらについても自分のレコード以外はアクセスを許可するべきではありません。これも同様に、Auth をクエリする際には必ず `owner_user_id = "{現在のUserID}"` の Where 句が入るようにすることです。

```go
func (Auth) Policy() ent.Policy {
	return privacy.Policy{
		Query: privacy.QueryPolicy{
			auth.AlloIfAdmin(),
			auth.CanSeeOnlyMine(),
		},
	}
}
```
