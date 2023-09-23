import { renderHook, act, waitFor } from "@testing-library/react-native";
import { SettingsStore, MemoryStorage } from "@hpapp/system/kvs";
import { SettingsProvider, useSettings } from "./index";

test("useSettings should return the current value and a function to update", async () => {
  const storage = new MemoryStorage();
  const mySettings = SettingsStore.register<string>("me", storage, {
    defaultValue: "Mizuki Fukumura",
  });

  const wrapper = ({ children }: { children: React.ReactElement }) => {
    return (
      <SettingsProvider settings={[mySettings]}>{children}</SettingsProvider>
    );
  };
  const one = renderHook(() => useSettings(mySettings), { wrapper });
  // first rendering doesn't load the context object as it's loading the value from async store.
  // so we need to rerender here
  one.rerender({});
  await waitFor(() => {
    expect(one.result.current[0]).toBe("Mizuki Fukumura");
  });

  // update the value
  await act(async () => {
    await one.result.current[1]("Risa Irie");
  });

  // value update is propergated via Map so it should immediately update the current value.
  await waitFor(() => {
    expect(one.result.current[0]).toBe("Risa Irie");
  });

  // another component should have the updated value.
  const another = renderHook(() => useSettings(mySettings), { wrapper });
  // another component should reload the settings from async store again.
  another.rerender({});
  await waitFor(() => {
    expect(another.result.current[0]).toBe("Risa Irie");
  });
});
