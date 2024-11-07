/**
 * @generated SignedSource<<ef8d411c490bd6346ca9a6818ca754c6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type useAuthAuthenticateMutation$variables = Record<PropertyKey, never>;
export type useAuthAuthenticateMutation$data = {
  readonly authenticate: {
    readonly accessToken: string;
    readonly id: string;
    readonly username: string;
  } | null | undefined;
};
export type useAuthAuthenticateMutation = {
  response: useAuthAuthenticateMutation$data;
  variables: useAuthAuthenticateMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "authenticate",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "accessToken",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "username",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "useAuthAuthenticateMutation",
    "selections": (v0/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "useAuthAuthenticateMutation",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "b1fdcc1c14430ef67109f2c8c66b0757",
    "id": null,
    "metadata": {},
    "name": "useAuthAuthenticateMutation",
    "operationKind": "mutation",
    "text": "mutation useAuthAuthenticateMutation {\n  authenticate {\n    id\n    accessToken\n    username\n  }\n}\n"
  }
};
})();

(node as any).hash = "2234698623d60fe88c4df3a31a95c534";

export default node;
