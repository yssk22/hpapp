# Expo

Mobile Application is built on top of [Expo](https://expo.dev) framework with TypeScript.
We also use paid [EAS service](https://expo.dev/eas) to build and submit buids to platform stores.

## File Structure

Main source code is located in `expo` directory and files at the root of the `expo` directory are configuration files for the Expo framework (`App.tsx` is an entry point). Here are brief explanations of each file/directory.

### `assets`

`assets` is a direcotry that contains any static assets icluding images, fonts, etc. If you want to have a feature specific assets, you can create `assets/{feature-name}` directory and put assets there.

### `config`

`config` is a direcotry that contains build configurations. `config/{env}/` is for the specific environment configurations to override `prod` configurations. You can refer to [build](./build.md) doc to see how to create a new build with the configurations.

Note that you should not include any sensitive information (such as API keys) in this directory but use Expo's enviroment variables instead.

### `features`

`features` directory is to organize user-facing features. Each feature should have index.ts (or index.tsx) file to export components, hooks, and contexts.

```text
features/
  {featurename}/
    internals/
    index.tsx
```

a feature can have a sub feature within the feature directory.

```text
features/
  {featurename}/
    {subfeaturename}/
      internals/
      index.tsx
```

### nameing convenstions

- A class name or component name should have `{FeatureName}{ComponentName}` format.

Note that `features/common` is a common feature that contains components, hooks, and contexts that can be used in multiple features so `{FeatureName}` prefix should be omitted.

### `foundation`

`foundation` is a directory that contains TypeScript foundations. These are utilitise for builtin types such as `Date`, `Error`, `Function`, ...etc. Each module here should not depends on any other third party libraries includig `react` or `expo`.

### `generated`

`generated`: a directory that contains auto generated code such as `schema.graphql`.

### `scripts`

`scripts` is a directory that contains scripts to automate development tasks.

### `system`

`system` is a direcotry that provides the wrapper framework for third party libraries such as kvs, i18n, ...etc. Each module here should not have any React components nor React hooks.

## Coding Standards

We have a few rules for importing modules. They are implemneted in esline rules and located in [`eslint-local-rules`](https://github.com/yssk22/hpapp/tree/main/expo/eslint-local-rules) directory and documented in [eslint.md](./eslint.md).

## See also

- [eslint.md](./eslint.md)
- [typedoc](./typedoc/index.html)
