import JSONStore from './JSONStore';
import MemoryStorage from './MemoryStorage';

test('should provide a typed storage', async () => {
  type Member = {
    name: string;
  };
  const mizuki = {
    name: 'Mizuki Fukumura'
  };
  const jsonstore = new JSONStore<Member>(new MemoryStorage());
  await jsonstore.set('mizuki', mizuki);
  const data = await jsonstore.get('mizuki');
  expect(data?.name).toBe(mizuki.name);
});

test("shouldn't provide Date support ", async () => {
  type Member = {
    name: string;
    birthday: Date;
  };
  const mizuki = {
    name: 'Mizuki Fukumura',
    birthday: new Date('1996/10/30')
  };
  const jsonstore = new JSONStore<Member>(new MemoryStorage());
  await jsonstore.set('mizuki', mizuki);
  const data = await jsonstore.get('mizuki');
  expect(data?.name).toBe(mizuki.name);
  expect(data?.birthday).not.toBe(mizuki.birthday);
});
