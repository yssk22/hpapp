/**
 * @generated SignedSource<<b29900cda7e6f35395d193246139146c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type HPFeedItemHPAssetType = "ameblo" | "elineupmall" | "instagram" | "tiktok" | "twitter" | "youtube" | "%future added value";
export type FeedItemQuery$variables = {
  feedId: string;
};
export type FeedItemQuery$data = {
  readonly node: {
    readonly assetType?: HPFeedItemHPAssetType;
    readonly id: string;
    readonly sourceURL?: string;
    readonly title?: string;
  } | null;
};
export type FeedItemQuery = {
  response: FeedItemQuery$data;
  variables: FeedItemQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "feedId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "feedId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "title",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "sourceURL",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "assetType",
      "storageKey": null
    }
  ],
  "type": "HPFeedItem",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "FeedItemQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "FeedItemQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          (v2/*: any*/),
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "a4c4c4cfd6286d29a15facc0f65ef4f7",
    "id": null,
    "metadata": {},
    "name": "FeedItemQuery",
    "operationKind": "query",
    "text": "query FeedItemQuery(\n  $feedId: ID!\n) {\n  node(id: $feedId) {\n    __typename\n    id\n    ... on HPFeedItem {\n      title\n      sourceURL\n      assetType\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "2a6be9df02ef2fa8ba635300ab83de60";

export default node;
