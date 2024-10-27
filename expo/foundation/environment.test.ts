import * as environment from './environment';

test('maybeDev', () => {
  expect(environment.maybeDev()).toBe(true);
});

test('maybeTest', () => {
  expect(environment.maybeTest()).toBe(true);
});
