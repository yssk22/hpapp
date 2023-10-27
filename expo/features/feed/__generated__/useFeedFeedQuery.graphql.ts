/**
 * @generated SignedSource<<36fabcd9104b2325d880a87aa1cee387>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type HPAssetType = "ameblo" | "elineup_mall" | "instagram" | "tiktok" | "twitter" | "youtube" | "%future added value";
export type HPFeedQueryParamsInput = {
  assetTypes?: ReadonlyArray<HPAssetType> | null;
  memberIDs?: ReadonlyArray<string> | null;
  minPostAt?: string | null;
  useMemberTaggings?: boolean | null;
};
export type useFeedFeedQuery$variables = {
  after?: any | null;
  first?: number | null;
  params: HPFeedQueryParamsInput;
};
export type useFeedFeedQuery$data = {
  readonly helloproject: {
    readonly " $fragmentSpreads": FragmentRefs<"useFeedQuery_helloproject_query_feed">;
  };
};
export type useFeedFeedQuery = {
  response: useFeedFeedQuery$data;
  variables: useFeedFeedQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "after"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "first"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "params"
},
v3 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "after"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "first"
  },
  {
    "kind": "Variable",
    "name": "params",
    "variableName": "params"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = [
  (v4/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "key",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "useFeedFeedQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "HelloProjectQuery",
        "kind": "LinkedField",
        "name": "helloproject",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "useFeedQuery_helloproject_query_feed"
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
    "argumentDefinitions": [
      (v2/*: any*/),
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "useFeedFeedQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "HelloProjectQuery",
        "kind": "LinkedField",
        "name": "helloproject",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v3/*: any*/),
            "concreteType": "HPFeedItemConnection",
            "kind": "LinkedField",
            "name": "feed",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "HPFeedItemEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "HPFeedItem",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v4/*: any*/),
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
                        "name": "sourceID",
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
                        "name": "imageURL",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "assetType",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "postAt",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "HPMember",
                        "kind": "LinkedField",
                        "name": "ownerMember",
                        "plural": false,
                        "selections": (v5/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "HPMember",
                        "kind": "LinkedField",
                        "name": "taggedMembers",
                        "plural": true,
                        "selections": (v5/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "HPViewHistory",
                        "kind": "LinkedField",
                        "name": "myViewHistory",
                        "plural": false,
                        "selections": [
                          (v4/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "isFavorite",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "__typename",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "cursor",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "PageInfo",
                "kind": "LinkedField",
                "name": "pageInfo",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "endCursor",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "hasNextPage",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v3/*: any*/),
            "filters": [
              "params"
            ],
            "handle": "connection",
            "key": "FeedQuery_helloproject_query_feed",
            "kind": "LinkedHandle",
            "name": "feed"
          },
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "8e271ec0e07a4452a06a0521ffd59b4d",
    "id": null,
    "metadata": {},
    "name": "useFeedFeedQuery",
    "operationKind": "query",
    "text": "query useFeedFeedQuery(\n  $params: HPFeedQueryParamsInput!\n  $first: Int\n  $after: Cursor\n) {\n  helloproject {\n    ...useFeedQuery_helloproject_query_feed\n    id\n  }\n}\n\nfragment FeedListItemFragment on HPFeedItem {\n  id\n  title\n  sourceID\n  sourceURL\n  imageURL\n  assetType\n  postAt\n  ownerMember {\n    id\n    key\n  }\n  taggedMembers {\n    id\n    key\n  }\n  ...FeedListItemViewHistoryIconFragment\n}\n\nfragment FeedListItemViewHistoryIconFragment on HPFeedItem {\n  myViewHistory {\n    id\n    isFavorite\n  }\n}\n\nfragment useFeedQuery_helloproject_query_feed on HelloProjectQuery {\n  feed(params: $params, first: $first, after: $after) {\n    edges {\n      node {\n        id\n        ...FeedListItemFragment\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  id\n}\n"
  }
};
})();

(node as any).hash = "ca31d7a1c2ed72859f64b0631ff65e83";

export default node;
