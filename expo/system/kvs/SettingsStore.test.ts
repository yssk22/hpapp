import MemoryStorage from "./MemoryStorage";
import SettingsStore from "./SettingsStore";

test("Settings", async () => {
  const storage = new MemoryStorage();
  const mizuki = SettingsStore.register("mizuki.fukumura", storage, {
    defaultValue: 10,
    description: "test",
  });
  const defaultValue = await mizuki.load();
  expect(defaultValue).toBe(10);
  await mizuki.save(20);
  const newValue = await mizuki.load();
  expect(newValue).toBe(20);

  // when the key is redefined, the old setting can be still fetched by using 'migrationFrom'
  const risa = SettingsStore.register("risa.irie", storage, {
    defaultValue: 30,
    description: "new version of test",
    migrationFrom: mizuki,
  });
  const risaValue = await risa.load();
  expect(risaValue).toBe(20);
});
