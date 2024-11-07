/**
 * @generated SignedSource<<dbf9ce164bd7260c4bff7c899186c3e7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type HPFeedItemHPAssetType = "ameblo" | "elineupmall" | "instagram" | "tiktok" | "twitter" | "youtube" | "%future added value";
export type FeedItemQuery$variables = {
  feedId: string;
};
export type FeedItemQuery$data = {
  readonly node: {
    readonly assetType?: HPFeedItemHPAssetType;
    readonly id: string;
    readonly media?: ReadonlyArray<{
      readonly url: string;
    }>;
    readonly ownerMember?: {
      readonly name: string;
    } | null | undefined;
    readonly sourceURL?: string;
    readonly title?: string;
    readonly " $fragmentSpreads": FragmentRefs<"FeedItemCTALove">;
  } | null | undefined;
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "sourceURL",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "assetType",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "concreteType": "Media",
  "kind": "LinkedField",
  "name": "media",
  "plural": true,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "url",
      "storageKey": null
    }
  ],
  "storageKey": null
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
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "HPMember",
                "kind": "LinkedField",
                "name": "ownerMember",
                "plural": false,
                "selections": [
                  (v6/*: any*/)
                ],
                "storageKey": null
              },
              (v7/*: any*/),
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "FeedItemCTALove"
              }
            ],
            "type": "HPFeedItem",
            "abstractKey": null
          }
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
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "HPMember",
                "kind": "LinkedField",
                "name": "ownerMember",
                "plural": false,
                "selections": [
                  (v6/*: any*/),
                  (v2/*: any*/)
                ],
                "storageKey": null
              },
              (v7/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "HPViewHistory",
                "kind": "LinkedField",
                "name": "myViewHistory",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
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
            "type": "HPFeedItem",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "b615b2c953455ff328845d67d6bc61e4",
    "id": null,
    "metadata": {},
    "name": "FeedItemQuery",
    "operationKind": "query",
    "text": "query FeedItemQuery(\n  $feedId: ID!\n) {\n  node(id: $feedId) {\n    __typename\n    id\n    ... on HPFeedItem {\n      title\n      sourceURL\n      assetType\n      ownerMember {\n        name\n        id\n      }\n      media {\n        url\n      }\n      ...FeedItemCTALove\n    }\n  }\n}\n\nfragment FeedItemCTALove on HPFeedItem {\n  id\n  myViewHistory {\n    id\n    isFavorite\n  }\n}\n"
  }
};
})();

(node as any).hash = "4eb42237081703cf0763304962388b0b";

export default node;
