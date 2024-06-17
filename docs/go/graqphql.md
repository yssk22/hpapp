# GraphQL

We take code-first approach to develop GraphQL. This is because of several reasons:

- avoid forgeting to update the schema changes when service code is changed.
- implement service code first to verify the feasibility of the implementation including database schema early.
- we use [entgo](https://entgo.io) framework that supports code generation from ent schema.

To achieve code-first approach, we use the combination of entgo framework and Go's static analysis package to generate GraphQL schema.

## Versioning

Our primary GraphQL client is a native mobile application so that users may not update the app frequently. So we should avoid breaking changes at GraphQL schema. To keep the schema backward compatible, we use the following versioning strategy:

- We use `github.com/yssk22/hpapp/go/graphql/v[X]` where [X] is the single integer of version numbers to define the version.
- In the v[X] package, we keep the schema compatibilty while internal implementation can be changed.
- Then the HTTP endpoint `/graphql/v[X]` is mapped to `github.com/yssk22/hpapp/go/graphql/v[X]`.
- When we need a backward incompatible change, we create a new version package v[X+1] and keep the old version for a while.

## See Also

- [github.com/yssk22/hpapp/go/graphql/](./godoc/pkg/github.com/yssk22/hpapp/go/graphql/index.html)
