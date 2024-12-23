/**
 * @generated SignedSource<<fff5b9277bc80b260305bb1325534f9f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type HPElineupMallItemCategory = "blueray" | "clear_file" | "colllection_other" | "colllection_photo" | "colllection_pinnap_poster" | "dvd" | "dvd_magazine" | "dvd_magazine_other" | "fsk" | "keyring_other" | "microfiber_towel" | "muffler_towel" | "other" | "penlight" | "photo2_l" | "photo_a4" | "photo_a5" | "photo_album" | "photo_album_other" | "photo_book" | "photo_book_other" | "photo_daily" | "photo_other" | "t_shirt" | "%future added value";
export type HPElineumpMallItemsParamsInput = {
  categories?: ReadonlyArray<HPElineupMallItemCategory> | null | undefined;
  memberCategories?: ReadonlyArray<HPElineumpMallItemsParamsMemberCategoriesInput> | null | undefined;
  memberIDs?: ReadonlyArray<string> | null | undefined;
};
export type HPElineumpMallItemsParamsMemberCategoriesInput = {
  categories?: ReadonlyArray<HPElineupMallItemCategory> | null | undefined;
  memberId: string;
};
export type ElineupMallLimitedTimeItemListQuery$variables = {
  after?: any | null | undefined;
  first?: number | null | undefined;
  params: HPElineumpMallItemsParamsInput;
};
export type ElineupMallLimitedTimeItemListQuery$data = {
  readonly helloproject: {
    readonly " $fragmentSpreads": FragmentRefs<"ElineupMallLimitedTimeItemListQuery_helloproject_query_elineupmall_items">;
  };
};
export type ElineupMallLimitedTimeItemListQuery = {
  response: ElineupMallLimitedTimeItemListQuery$data;
  variables: ElineupMallLimitedTimeItemListQuery$variables;
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
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ElineupMallLimitedTimeItemListQuery",
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
            "name": "ElineupMallLimitedTimeItemListQuery_helloproject_query_elineupmall_items"
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
      (v1/*: any*/),
      (v0/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Operation",
    "name": "ElineupMallLimitedTimeItemListQuery",
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
            "concreteType": "HPElineupMallItemConnection",
            "kind": "LinkedField",
            "name": "elineupMallItems",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "HPElineupMallItemEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "HPElineupMallItem",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v4/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "name",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "permalink",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "description",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "price",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "isLimitedToFc",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "isOutOfStock",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Media",
                        "kind": "LinkedField",
                        "name": "images",
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
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "category",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "orderStartAt",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "orderEndAt",
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
            "key": "ElineupMallLimitedTimeItemListQuery_helloproject_query_elineupMallItems",
            "kind": "LinkedHandle",
            "name": "elineupMallItems"
          },
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "be25bc7b64118ca4dea7c73715acf882",
    "id": null,
    "metadata": {},
    "name": "ElineupMallLimitedTimeItemListQuery",
    "operationKind": "query",
    "text": "query ElineupMallLimitedTimeItemListQuery(\n  $first: Int\n  $after: Cursor\n  $params: HPElineumpMallItemsParamsInput!\n) {\n  helloproject {\n    ...ElineupMallLimitedTimeItemListQuery_helloproject_query_elineupmall_items\n    id\n  }\n}\n\nfragment ElineupMallLimitedTimeItemListItemFragment on HPElineupMallItem {\n  id\n  name\n  permalink\n  description\n  price\n  isLimitedToFc\n  isOutOfStock\n  images {\n    url\n  }\n  category\n  orderStartAt\n  orderEndAt\n}\n\nfragment ElineupMallLimitedTimeItemListQuery_helloproject_query_elineupmall_items on HelloProjectQuery {\n  elineupMallItems(first: $first, after: $after, params: $params) {\n    edges {\n      node {\n        id\n        ...ElineupMallLimitedTimeItemListItemFragment\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  id\n}\n"
  }
};
})();

(node as any).hash = "de4b66af2ac59c15865fd00956bc88c8";

export default node;
