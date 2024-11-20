/**
 * @generated SignedSource<<e1cfdc6b4baf0ecae744fb7b2261c66f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AccountDeletionButtonDeleteAccountMutation$variables = Record<PropertyKey, never>;
export type AccountDeletionButtonDeleteAccountMutation$data = {
  readonly me: {
    readonly delete: boolean;
  } | null | undefined;
};
export type AccountDeletionButtonDeleteAccountMutation = {
  response: AccountDeletionButtonDeleteAccountMutation$data;
  variables: AccountDeletionButtonDeleteAccountMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "MeMutation",
    "kind": "LinkedField",
    "name": "me",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "delete",
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
    "name": "AccountDeletionButtonDeleteAccountMutation",
    "selections": (v0/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "AccountDeletionButtonDeleteAccountMutation",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "a7e32fcaca02fff97d5750c5746f5854",
    "id": null,
    "metadata": {},
    "name": "AccountDeletionButtonDeleteAccountMutation",
    "operationKind": "mutation",
    "text": "mutation AccountDeletionButtonDeleteAccountMutation {\n  me {\n    delete\n  }\n}\n"
  }
};
})();

(node as any).hash = "87775849a3002dbc72b548abb8dfb159";

export default node;
