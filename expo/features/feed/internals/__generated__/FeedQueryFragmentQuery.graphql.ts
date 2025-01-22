/**
 * @generated SignedSource<<d30e4cefe21c0430e1389bbb1ae7953c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type HPAssetType = "ameblo" | "elineup_mall" | "instagram" | "tiktok" | "twitter" | "youtube" | "%future added value";
export type HPFeedQueryParamsInput = {
  artistIDs?: ReadonlyArray<string> | null | undefined;
  assetTypes?: ReadonlyArray<HPAssetType> | null | undefined;
  memberIDs?: ReadonlyArray<string> | null | undefined;
  minPostAt?: string | null | undefined;
  useMemberTaggings?: boolean | null | undefined;
};
export type FeedQueryFragmentQuery$variables = {
  after?: any | null | undefined;
  first?: number | null | undefined;
  id: string;
  params: HPFeedQueryParamsInput;
};
export type FeedQueryFragmentQuery$data = {
  readonly node: {
    readonly " $fragmentSpreads": FragmentRefs<"FeedQuery_helloproject_query_feed">;
  } | null | undefined;
};
export type FeedQueryFragmentQuery = {
  response: FeedQueryFragmentQuery$data;
  variables: FeedQueryFragmentQuery$variables;
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
  "name": "id"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "params"
},
v4 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v7 = [
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
v8 = [
  (v6/*: any*/),
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
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "FeedQueryFragmentQuery",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "FeedQuery_helloproject_query_feed"
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
      (v0/*: any*/),
      (v1/*: any*/),
      (v3/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Operation",
    "name": "FeedQueryFragmentQuery",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v5/*: any*/),
          (v6/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": (v7/*: any*/),
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
                          (v6/*: any*/),
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
                            "selections": (v8/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "HPMember",
                            "kind": "LinkedField",
                            "name": "taggedMembers",
                            "plural": true,
                            "selections": (v8/*: any*/),
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
                              (v6/*: any*/),
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
                          (v5/*: any*/)
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
                "args": (v7/*: any*/),
                "filters": [
                  "params"
                ],
                "handle": "connection",
                "key": "FeedQuery_helloproject_query_feed",
                "kind": "LinkedHandle",
                "name": "feed"
              }
            ],
            "type": "HelloProjectQuery",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "a8f519b1100c76cfd1ed2bbe373ec322",
    "id": null,
    "metadata": {},
    "name": "FeedQueryFragmentQuery",
    "operationKind": "query",
    "text": "query FeedQueryFragmentQuery(\n  $after: Cursor\n  $first: Int\n  $params: HPFeedQueryParamsInput!\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ...FeedQuery_helloproject_query_feed\n    id\n  }\n}\n\nfragment FeedListItemFragment on HPFeedItem {\n  id\n  title\n  sourceID\n  sourceURL\n  imageURL\n  assetType\n  postAt\n  ownerMember {\n    id\n    key\n  }\n  taggedMembers {\n    id\n    key\n  }\n  ...FeedListItemViewHistoryIconFragment\n}\n\nfragment FeedListItemViewHistoryIconFragment on HPFeedItem {\n  myViewHistory {\n    id\n    isFavorite\n  }\n}\n\nfragment FeedQuery_helloproject_query_feed on HelloProjectQuery {\n  feed(params: $params, first: $first, after: $after) {\n    edges {\n      node {\n        id\n        ...FeedListItemFragment\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  id\n}\n"
  }
};
})();

(node as any).hash = "5b8c49515bf5d614e6023c2240cb9dfa";

export default node;
