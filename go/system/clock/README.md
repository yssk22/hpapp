# システムクロック

## time.Now() からの脱却

時間に関するテストを行う場合、最も良くある間違いは現在時刻の取得に、`time.Now()` を使うことです。 `time.Now()` を使ったプログラムはシステムクロックに依存しています。この依存関係を取り除くために、現在時刻を取得するには `system/clock.Now(context.Context)` を利用してください。

例えば次の関数は、今日が与えられたメンバーの誕生日かどうかを判定する者です。

```go
func IsBirthdayToday(birthday time.Time) bool {
	_, m1, d1 := time.Now().In(birthday.Location()).Date()
	_, m2, d2 := birthday.Date()
	return m1 == m2 && d1 == d2
}
```

これに対して次の様なテストを書きます。

```go
func TestIsBirthdayToday(t testing.T) bool {
	birthday := time.Date(1996, 10, 30, 0, 0, 0, 0, timeutil.JST)
    a.OK(IsBirthdayToday(birthday))
}
```

このテストコードは、10 月 30 日 (譜久村聖さんの誕生日) にしかパスしいないテストになります。誕生日当日はバースデーイベントがある可能性が高いので確認する暇もありません。

そこで、いつでもテストできるように実装を `time.Now()` を `clock.Now(context.Context)` に置き換えます。

```go
func IsBirthdayToday(ctx context.Context, birthday time.Time) bool {
	_, m1, d1 := clock.Now(ctx).In(birthday.Location()).Date()
	_, m2, d2 := birthday.Date()
	return m1 == m2 && d1 == d2
}
```

そしてテストで `clock.SetNow(time.Time)` を用いて現在時刻を設定することで、誕生日当日および誕生日以外の任意の時刻についてテストができるようになります。

```go
func TestIsBirthdayToday(t testing.T) bool {
    ctx := context.Background()

    // 現在の時刻が 2023/10/30 10:10 のとき
    ctx = clock.SetNow(time.Date(2023, 10, 30, 10, 10, 0, 0, timeutil.JST))
	birthday := time.Date(1996, 10, 30, 0, 0, 0, 0, timeutil.JST)
    a.OK(IsBirthdayToday(birthday))

    // 現在の時刻が 2023/10/18 10:10 のとき
    ctx = clock.SetNow(time.Date(2023, 10, 18, 10, 10, 0, 0, timeutil.JST))
    a.OK(!IsBirthdayToday(birthday))
}
```

## コンテキスト生成時刻

また現在時刻を取得する必要が本当にあるのかどうか検討します。現在時刻の取得を行わずにコンテキストの生成時刻を取得することで簡単にプログラムのパフォーマンスができる場合があります。厳密な現在時刻を取得する必要がない場合は、 `clock.ContextTime(ctx)` を利用するようにしてください。

参考までにベンチマークの結果を掲載します。

###

```go
func BenchmarkNow(b *testing.B) {
	ctx := context.Background()
	for i := 0; i < b.N; i++ {
		Now(ctx)
	}
}

func BenchmarkContextTime(b *testing.B) {
	ctx := ccontext.WithContext(
		context.Background(),
	)
	for i := 0; i < b.N; i++ {
		ContextTime(ctx)
	}
}
```

```shell
$ go test -v -bench=. ./system/clock/
=== RUN   TestContext
--- PASS: TestContext (0.00s)
goos: linux
goarch: amd64
pkg: hpapp.yssk22.dev/gosystem/clock
cpu: AMD Ryzen 9 3900X 12-Core Processor
BenchmarkNow
BenchmarkNow-24                 27254952                42.73 ns/op
BenchmarkContextTime
BenchmarkContextTime-24         201749592                5.959 ns/op
PASS
```
