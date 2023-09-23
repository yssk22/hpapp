package timeutil

import (
	"regexp"
	"strconv"
	"time"
)

var (
	JST = time.FixedZone("+0900", 9*60*60)
)

var jpDateRegexp = regexp.MustCompile(`(?:(\d{4})年)?(\d{1,2})月(\d{1,2})日`)

// ParseJPDate parse the string expression of JP date YYYY年MM月DD日 and returns it as time.Time
// YYYY年 can be omitted and hintYear is used for that case. If `hintYear` is 0, Now().Year() is used as an year.
func ParseJPDate(s string, hintYear int) time.Time {
	if matched := jpDateRegexp.FindStringSubmatch(s); matched != nil {
		var y, m, d int
		if matched[1] == "" {
			y = hintYear
			if y == 0 {
				y = time.Now().Year() //nolint:gocritic // we use Now() for parsing
			}
		} else {
			y, _ = strconv.Atoi(matched[1])
		}
		m, _ = strconv.Atoi(matched[2])
		d, _ = strconv.Atoi(matched[3])
		return time.Date(y, time.Month(m), d, 0, 0, 0, 0, JST)
	}
	return time.Time{}
}

// Date normalizes the time.Time object to point to the specific date at 00:00:00
func Date(t time.Time) time.Time {
	return time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, t.Location())
}

// JSTDate returns the time in JST timezone.
func JSTDate(t time.Time) time.Time {
	return Date(t.In(JST))
}
