import * as date from './date';

describe('date', () => {
  test('parseDate', () => {
    expect(date.parseDate(new Date('2005/10/18'))).toEqual(new Date('2005/10/18 00:00:00'));
    expect(date.parseDate(new Date('2005/10/18').getTime())).toEqual(new Date('2005/10/18 00:00:00'));
    expect(date.parseDate('2005/10/18')).toEqual(new Date('2005/10/18 00:00:00'));
    expect(isNaN(date.parseDate(null).getTime()));
  });

  test('addDate', () => {
    expect(date.addDate(new Date('2005/10/18'), 1, 'minute')).toEqual(new Date('2005/10/18 00:01:00'));
    expect(date.addDate(new Date('2005/10/18'), 1, 'hour')).toEqual(new Date('2005/10/18 01:00:00'));
    expect(date.addDate(new Date('2005/10/18'), 1, 'day')).toEqual(new Date('2005/10/19 00:00:00'));
  });

  test('toWeekdayString', () => {
    expect(date.toWeekdayString(new Date('2005/10/18'))).toEqual('Tuesday');
  });

  test('toWeekdayStringShort', () => {
    expect(date.toShortWeekdayString(new Date('2005/10/18'))).toEqual('Tue');
  });

  test('toDateString', () => {
    expect(date.toDateString(new Date('2005/10/18'))).toEqual('2005/10/18');
  });

  test('toTimeString', () => {
    // toTimezone also converts the the time to JST by default
    expect(date.toTimeString(new Date('2005-10-18T10:18:23Z'))).toEqual('19:18');
  });

  test('toDateTimeString', () => {
    // toTimezone also converts the the time to JST by default
    expect(date.toDateTimeString(new Date('2005-10-18T22:18:23Z'))).toEqual('2005/10/19 07:18');
  });

  test('getDate', () => {
    expect(date.getDate(new Date('2005/10/18 10:18:23'))).toEqual(new Date('2005/10/18'));
  });

  test('toQueryString', () => {
    expect(date.toQueryString(new Date('2005/10/18 10:18:23'))).toEqual('2005-10-18T10:18:23.000');
    expect(date.toQueryString(new Date('abc'))).toEqual('');
  });

  test('toNullableQueryString', () => {
    expect(date.toNullableQueryString(new Date('2005/10/18 10:18:23'))).toEqual('2005-10-18T10:18:23.000');
    expect(date.toNullableQueryString(new Date('abc'))).toEqual('null');
  });

  test('getDuration', () => {
    expect(date.getDuration(new Date('2005/10/18'), new Date('2005/10/18'), 'day')).toEqual(0);
    expect(date.getDuration(new Date('2006/10/18'), new Date('2005/10/18'), 'year')).toEqual(1);
    expect(date.getDuration(new Date('2006/10/18'), new Date('2005/10/18'), 'month')).toEqual(12);
    expect(date.getDuration(new Date('2006/10/18'), new Date('2005/10/18'), 'week')).toEqual(52);
    expect(date.getDuration(new Date('2006/10/18'), new Date('2005/10/18'), 'day')).toEqual(365);
    expect(date.getDuration(new Date('2006/10/18'), new Date('2005/10/18'), 'hour')).toEqual(365 * 24);
    expect(date.getDuration(new Date('2006/10/18'), new Date('2005/10/18'), 'minute')).toEqual(365 * 24 * 60);
    expect(date.getDuration(new Date('2006/10/18'), new Date('2005/10/18'), 'second')).toEqual(365 * 24 * 60 * 60);
  });

  test('getAge', () => {
    expect(date.getAge(new Date('2005/10/18'), { at: new Date('2005/10/18') })).toEqual(0);
    expect(date.getAge(new Date('2005/10/18'), { at: new Date('2006/10/18') })).toEqual(1);
    expect(date.getAge(new Date('2005/10/18'), { at: new Date('2006/10/19') })).toEqual(1);
    expect(date.getAge(new Date('2005/10/18'), { at: new Date('2006/10/17') })).toEqual(0);
  });

  test('getSchoolGrade', () => {
    expect(date.getSchoolGrade(new Date('2005/10/18'), new Date('2005/10/18'))).toEqual('');
    expect(date.getSchoolGrade(new Date('2005/10/18'), new Date('2012/04/01'))).toEqual('小1');
    expect(date.getSchoolGrade(new Date('2005/10/18'), new Date('2018/03/31'))).toEqual('小6');
    expect(date.getSchoolGrade(new Date('2005/10/18'), new Date('2018/04/01'))).toEqual('中1');
    expect(date.getSchoolGrade(new Date('2005/10/18'), new Date('2021/03/31'))).toEqual('中3');
    expect(date.getSchoolGrade(new Date('2005/10/18'), new Date('2021/04/01'))).toEqual('高1');
    expect(date.getSchoolGrade(new Date('2005/10/18'), new Date('2024/03/31'))).toEqual('高3');
    expect(date.getSchoolGrade(new Date('2005/10/18'), new Date('2024/04/01'))).toEqual('大1');
  });
});
