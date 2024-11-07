/**
 * @generated SignedSource<<5308d40ff1d41ba8c8de223dd171d1b5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type HPFollowHPFollowType = "follow" | "follow_with_notification" | "unfollow" | "%future added value";
export type HPFollowType = "follow" | "follow_with_notification" | "unfollow" | "%future added value";
export type HPFollowUpsertParamsInput = {
  followType: HPFollowType;
  memberId: number;
};
export type useFollowingsMutation$variables = {
  params: HPFollowUpsertParamsInput;
};
export type useFollowingsMutation$data = {
  readonly me: {
    readonly upsertFollow: {
      readonly id: string;
      readonly member: {
        readonly id: string;
      };
      readonly type: HPFollowHPFollowType;
    } | null;
  } | null;
};
export type useFollowingsMutation = {
  response: useFollowingsMutation$data;
  variables: useFollowingsMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "params"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
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
        "args": [
          {
            "kind": "Variable",
            "name": "params",
            "variableName": "params"
          }
        ],
        "concreteType": "HPFollow",
        "kind": "LinkedField",
        "name": "upsertFollow",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "type",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "HPMember",
            "kind": "LinkedField",
            "name": "member",
            "plural": false,
            "selections": [
              (v1/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "useFollowingsMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useFollowingsMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "b2202f91b8f46a5cc56c3eb13e14b876",
    "id": null,
    "metadata": {},
    "name": "useFollowingsMutation",
    "operationKind": "mutation",
    "text": "mutation useFollowingsMutation(\n  $params: HPFollowUpsertParamsInput!\n) {\n  me {\n    upsertFollow(params: $params) {\n      id\n      type\n      member {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "46d96778a0b7b388ea78b913591f25e1";

export default node;
