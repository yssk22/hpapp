/**
 * @generated SignedSource<<2150c1899edd3606279aaa7f84411bc9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type HPFollowHPFollowType = "follow" | "follow_with_notification" | "unfollow" | "%future added value";
export type HPFollowType = "follow" | "follow_with_notification" | "unfollow" | "%future added value";
export type HPFollowUpsertParamsInput = {
  followType: HPFollowType;
  memberId: number;
};
export type useUpsertFollowMutation$variables = {
  params: HPFollowUpsertParamsInput;
};
export type useUpsertFollowMutation$data = {
  readonly me: {
    readonly upsertFollow: {
      readonly id: string;
      readonly member: {
        readonly id: string;
      };
      readonly type: HPFollowHPFollowType;
    } | null | undefined;
  } | null | undefined;
};
export type useUpsertFollowMutation = {
  response: useUpsertFollowMutation$data;
  variables: useUpsertFollowMutation$variables;
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
    "name": "useUpsertFollowMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useUpsertFollowMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "229e234f263ac9f8907abff58f736125",
    "id": null,
    "metadata": {},
    "name": "useUpsertFollowMutation",
    "operationKind": "mutation",
    "text": "mutation useUpsertFollowMutation(\n  $params: HPFollowUpsertParamsInput!\n) {\n  me {\n    upsertFollow(params: $params) {\n      id\n      type\n      member {\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "b7f6845140f00007d85f77814a46eb86";

export default node;
