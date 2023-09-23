/**
 * @generated SignedSource<<0261f071dca3015312e0c8dddfca095c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type HPAssetType = "ameblo" | "elineup_mall" | "instagram" | "tiktok" | "twitter" | "youtube" | "%future added value";
export type HPFeedItemHPAssetType = "ameblo" | "elineupmall" | "instagram" | "tiktok" | "twitter" | "youtube" | "%future added value";
export type HPFeedQueryParamsInput = {
  assetTypes?: ReadonlyArray<HPAssetType> | null;
  memberIDs?: ReadonlyArray<string> | null;
  useMemberTaggings?: boolean | null;
};
export type useFeedItemsQuery$variables = {
  after?: any | null;
  first?: number | null;
  params: HPFeedQueryParamsInput;
};
export type useFeedItemsQuery$data = {
  readonly helloproject: {
    readonly feed: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly assetType: HPFeedItemHPAssetType;
          readonly id: string;
          readonly imageURL: string | null;
          readonly myViewHistory: {
            readonly id: string;
            readonly isFavorite: boolean;
          } | null;
          readonly ownerMember: {
            readonly id: string;
            readonly key: string;
          } | null;
          readonly postAt: string;
          readonly sourceID: number;
          readonly sourceURL: string;
          readonly taggedMembers: ReadonlyArray<{
            readonly id: string;
            readonly key: string;
          }> | null;
          readonly title: string;
        } | null;
      } | null> | null;
    } | null;
  };
};
export type useFeedItemsQuery = {
  response: useFeedItemsQuery$data;
  variables: useFeedItemsQuery$variables;
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
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = [
  (v3/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "key",
    "storageKey": null
  }
],
v5 = [
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
        "args": [
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
                  (v3/*: any*/),
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
                    "selections": (v4/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "HPMember",
                    "kind": "LinkedField",
                    "name": "taggedMembers",
                    "plural": true,
                    "selections": (v4/*: any*/),
                    "storageKey": null
                  },
                  {
                    "kind": "ClientExtension",
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "HPViewHistory",
                        "kind": "LinkedField",
                        "name": "myViewHistory",
                        "plural": false,
                        "selections": [
                          (v3/*: any*/),
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
                    ]
                  }
                ],
                "storageKey": null
              }
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "useFeedItemsQuery",
    "selections": (v5/*: any*/),
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
    "name": "useFeedItemsQuery",
    "selections": (v5/*: any*/)
  },
  "params": {
    "cacheID": "a1638470b606ac1181d2b22b65d11469",
    "id": null,
    "metadata": {},
    "name": "useFeedItemsQuery",
    "operationKind": "query",
    "text": "query useFeedItemsQuery(\n  $params: HPFeedQueryParamsInput!\n  $first: Int\n  $after: Cursor\n) {\n  helloproject {\n    feed(params: $params, first: $first, after: $after) {\n      edges {\n        node {\n          id\n          sourceID\n          title\n          sourceURL\n          imageURL\n          assetType\n          postAt\n          ownerMember {\n            id\n            key\n          }\n          taggedMembers {\n            id\n            key\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "95a5c199ab9d9dc005a3d08e1f908ed0";

export default node;
