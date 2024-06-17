/*
Package clock provides a way to get the current time in a way that can be controlled in tests.

If you are testing time related functions, the most common mistake is to use `time.Now()` to get the current time. A program that uses `time.Now()` is dependent on the system clock.
To remove this dependency, use `system/clock.Now(context.Context)` to get the current time.

For example, the following function is a function that determines whether today is the birthday of the given member.

	func IsBirthdayToday(birthday time.Time) bool {
		_, m1, d1 := time.Now().In(birthday.Location()).Date()
		_, m2, d2 := birthday.Date()
		return m1 == m2 && d1 == d2
	}

You can write a test like this:

	func TestIsBirthdayToday(t testing.T) bool {
		birthday := time.Date(1996, 10, 30, 0, 0, 0, 0, timeutil.JST)
		a.OK(IsBirthdayToday(birthday))
	}

This test code only passes on October 30th (Fukumura Mizuki's birthday). There is no time for you to check because there is likely to be a birthday event on the birthday.

To make it possible to test at any time, replace the implementation with `clock.Now()` with `clock.Now(context.Context)`.

	func IsBirthdayToday(ctx context.Context, birthday time.Time) bool {
		_, m1, d1 := clock.Now(ctx).In(birthday.Location()).Date()
		_, m2, d2 := birthday.Date()
		return m1 == m2 && d1 == d2
	}

And by using `clock.SetNow(time.Time)` in the test, you can set the current time to the birthday and any other time to test.

	func TestIsBirthdayToday(t testing.T) bool {
		ctx := context.Background()

		// Assume the current time is 2023/10/30 10:10
		ctx = clock.SetNow(time.Date(2023, 10, 30, 10, 10, 0, 0, timeutil.JST))
		birthday := time.Date(1996, 10, 30, 0, 0, 0, 0, timeutil.JST)
		a.OK(IsBirthdayToday(birthday))

		// Assume the current time is 2023/10/18 10:10 のとき
		ctx = clock.SetNow(time.Date(2023, 10, 18, 10, 10, 0, 0, timeutil.JST))
		a.OK(!IsBirthdayToday(birthday))
	}

# Context Time

In some cases, you can need to get the current time in the context, instead of the now. This can avoid calling clock.Now() in production to improve the performance slightly.
In such cases, use `clock.ContextTime(context.Context)` to get the time in the context. Here is a benchmark of context.Now() vs context.ContextTime(context.Context).

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

	$ go test -v -bench=. ./system/clock/
	=== RUN   TestContext
	--- PASS: TestContext (0.00s)
	goos: linux
	goarch: amd64
	pkg: github.com/yssk22/hpapp/gosystem/clock
	cpu: AMD Ryzen 9 3900X 12-Core Processor
	BenchmarkNow
	BenchmarkNow-24                 27254952                42.73 ns/op
	BenchmarkContextTime
	BenchmarkContextTime-24         201749592                5.959 ns/op
	PASS
*/
package clock
