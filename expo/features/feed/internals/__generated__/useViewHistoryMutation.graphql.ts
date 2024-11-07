/**
 * @generated SignedSource<<c9489d76bcaade3331e34afa7cddc53a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type HPViewHistoryUpsertParamsInput = {
  feedId: number;
  isFavorite: boolean;
  userId: number;
};
export type useViewHistoryMutation$variables = {
  params: HPViewHistoryUpsertParamsInput;
};
export type useViewHistoryMutation$data = {
  readonly me: {
    readonly upsertViewHistory: {
      readonly id: string;
      readonly isFavorite: boolean;
    } | null | undefined;
  } | null | undefined;
};
export type useViewHistoryMutation = {
  response: useViewHistoryMutation$data;
  variables: useViewHistoryMutation$variables;
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
        "concreteType": "HPViewHistory",
        "kind": "LinkedField",
        "name": "upsertViewHistory",
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
            "name": "isFavorite",
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
    "name": "useViewHistoryMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useViewHistoryMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "269707bfe941f13156915dfda942db19",
    "id": null,
    "metadata": {},
    "name": "useViewHistoryMutation",
    "operationKind": "mutation",
    "text": "mutation useViewHistoryMutation(\n  $params: HPViewHistoryUpsertParamsInput!\n) {\n  me {\n    upsertViewHistory(params: $params) {\n      id\n      isFavorite\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "be2cc0f4f39ca691eff978af846ef746";

export default node;
