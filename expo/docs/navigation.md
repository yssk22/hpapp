# Navigation

hpapp では [React Navigation]('https://reactnavigation.org/') を採用し、かつ Type Safe な Navigation Wrapper を実装しています。`Screen` と呼ばれるデバイス全体を表示するためのコンテナコンポーネントをスタック上に配置し、スクリーン間の遷移を useNavigation() フックにより実現します。

## Screen の定義

新しい Screen を定義する場合は、 `feature/{path/to/yourfeature}/{Name}Screen.tsx` を作成しその上で `defineScreen(string, React.ElementType)` で定義される `Screen` オブジェクトをデフォルトエスエクスポートします。

```typescript
export default defineScreen(
  "/my/feature/",
  function ({ children }: { children: React.ReactElement }) {
    return <>{children}</>;
  }
);
```

その後、`yarn genscreen` を実行します。これは features 以下にある `*Screen.tsx` ファイルを一カ所に集約して `Screen.tsx` ファイルを生成するものです。
