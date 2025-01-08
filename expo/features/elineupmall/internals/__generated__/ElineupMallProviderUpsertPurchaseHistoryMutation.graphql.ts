/**
 * @generated SignedSource<<e93e269beed0777c0026c3150a565b47>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type HPElineupMallItemPurchaseHistoryUpsertParamsInput = {
  orders?: ReadonlyArray<HPElineupMallItemPurchasedItemOrderDetailsInput> | null | undefined;
  userId: number;
};
export type HPElineupMallItemPurchasedItemOrderDetailsInput = {
  name: string;
  num: number;
  orderId: string;
  orderedAt: string;
  permalink: string;
  price: number;
};
export type ElineupMallProviderUpsertPurchaseHistoryMutation$variables = {
  params: HPElineupMallItemPurchaseHistoryUpsertParamsInput;
};
export type ElineupMallProviderUpsertPurchaseHistoryMutation$data = {
  readonly me: {
    readonly upsertElineupmallPurchaseHistories: ReadonlyArray<{
      readonly id: string;
    } | null | undefined> | null | undefined;
  } | null | undefined;
};
export type ElineupMallProviderUpsertPurchaseHistoryMutation = {
  response: ElineupMallProviderUpsertPurchaseHistoryMutation$data;
  variables: ElineupMallProviderUpsertPurchaseHistoryMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "params"
  }
],
v1 = [
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
        "concreteType": "HPElineupMallItemPurchaseHistory",
        "kind": "LinkedField",
        "name": "upsertElineupmallPurchaseHistories",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
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
    "name": "ElineupMallProviderUpsertPurchaseHistoryMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ElineupMallProviderUpsertPurchaseHistoryMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "2a3bdb6d0579eac2a65de54dd569eb48",
    "id": null,
    "metadata": {},
    "name": "ElineupMallProviderUpsertPurchaseHistoryMutation",
    "operationKind": "mutation",
    "text": "mutation ElineupMallProviderUpsertPurchaseHistoryMutation(\n  $params: HPElineupMallItemPurchaseHistoryUpsertParamsInput!\n) {\n  me {\n    upsertElineupmallPurchaseHistories(params: $params) {\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "f6eef1c3294e8aca6342d01bb4033237";

export default node;
