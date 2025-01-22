/**
 * @generated SignedSource<<6dfcc09c3f498c150eefc6b9d7fcd664>>
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
  artistCategories?: ReadonlyArray<HPElineumpMallItemsParamsArtistCategoriesInput> | null | undefined;
  artistIDs?: ReadonlyArray<string> | null | undefined;
  categories?: ReadonlyArray<HPElineupMallItemCategory> | null | undefined;
  memberCategories?: ReadonlyArray<HPElineumpMallItemsParamsMemberCategoriesInput> | null | undefined;
  memberIDs?: ReadonlyArray<string> | null | undefined;
};
export type HPElineumpMallItemsParamsMemberCategoriesInput = {
  categories?: ReadonlyArray<HPElineupMallItemCategory> | null | undefined;
  memberId: string;
};
export type HPElineumpMallItemsParamsArtistCategoriesInput = {
  artistId: string;
  categories?: ReadonlyArray<HPElineupMallItemCategory> | null | undefined;
};
export type ElineupMallLimitedTimeItemListQueryFragmentQuery$variables = {
  after?: any | null | undefined;
  first?: number | null | undefined;
  id: string;
  params: HPElineumpMallItemsParamsInput;
};
export type ElineupMallLimitedTimeItemListQueryFragmentQuery$data = {
  readonly node: {
    readonly " $fragmentSpreads": FragmentRefs<"ElineupMallLimitedTimeItemListQuery_helloproject_query_elineupmall_items">;
  } | null | undefined;
};
export type ElineupMallLimitedTimeItemListQueryFragmentQuery = {
  response: ElineupMallLimitedTimeItemListQueryFragmentQuery$data;
  variables: ElineupMallLimitedTimeItemListQueryFragmentQuery$variables;
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
    "name": "ElineupMallLimitedTimeItemListQueryFragmentQuery",
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
      (v0/*: any*/),
      (v1/*: any*/),
      (v3/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Operation",
    "name": "ElineupMallLimitedTimeItemListQueryFragmentQuery",
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
                          (v6/*: any*/),
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
                            "name": "name",
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
                "key": "ElineupMallLimitedTimeItemListQuery_helloproject_query_elineupMallItems",
                "kind": "LinkedHandle",
                "name": "elineupMallItems"
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
    "cacheID": "64589004f7e17e01c5f0fd646a98c7e3",
    "id": null,
    "metadata": {},
    "name": "ElineupMallLimitedTimeItemListQueryFragmentQuery",
    "operationKind": "query",
    "text": "query ElineupMallLimitedTimeItemListQueryFragmentQuery(\n  $after: Cursor\n  $first: Int\n  $params: HPElineumpMallItemsParamsInput!\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ...ElineupMallLimitedTimeItemListQuery_helloproject_query_elineupmall_items\n    id\n  }\n}\n\nfragment ElineupMallLimitedTimeItemListItemFragment on HPElineupMallItem {\n  id\n  name\n  permalink\n  description\n  price\n  isLimitedToFc\n  isOutOfStock\n  images {\n    url\n  }\n  category\n  orderStartAt\n  orderEndAt\n}\n\nfragment ElineupMallLimitedTimeItemListQuery_helloproject_query_elineupmall_items on HelloProjectQuery {\n  elineupMallItems(first: $first, after: $after, params: $params) {\n    edges {\n      node {\n        id\n        permalink\n        ...ElineupMallLimitedTimeItemListItemFragment\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  id\n}\n"
  }
};
})();

(node as any).hash = "51b8104b42d9cf3b86c217b2478fc028";

export default node;
