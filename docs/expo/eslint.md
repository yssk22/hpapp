# ESlint custome rules

## no-internals-import

When you use a component in the feature directory, you should export it in the `index.tsx` file and import it from the `index.tsx` file. The rule is to ensure you don't import internal modules from the other feature's directory.

```typescript
// In features/yourfeature/internals/MyComponent.tsx

// DON'T
import ComponentA from "@hpapp/features/myfeature/internals/ComponentA";

// DO
import ComponentA from "@hpapp/features/myfeature";
```

## use-relative-import

When you use a internal comopnent in the same feature directory, you should import it using the relative path.

```typescript
// In features/myfeature/internals/MyComponent.tsx

// DON'T
import ComponentA from "@hpapp/features/myfeature/internals/ComponentA";

// DO
import ComponentA from "./ComponentA";
```
