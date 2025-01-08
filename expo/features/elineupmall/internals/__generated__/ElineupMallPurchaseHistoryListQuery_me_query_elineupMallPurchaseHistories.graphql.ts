/**
 * @generated SignedSource<<94c75daec0ed550856e16c4adeab0e39>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ElineupMallPurchaseHistoryListQuery_me_query_elineupMallPurchaseHistories$data = {
  readonly elineupMallPurchaseHistories: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly " $fragmentSpreads": FragmentRefs<"ElineupMallPurchaseHistoryListItemFragment">;
      } | null | undefined;
    } | null | undefined> | null | undefined;
  } | null | undefined;
  readonly id: string;
  readonly " $fragmentType": "ElineupMallPurchaseHistoryListQuery_me_query_elineupMallPurchaseHistories";
};
export type ElineupMallPurchaseHistoryListQuery_me_query_elineupMallPurchaseHistories$key = {
  readonly " $data"?: ElineupMallPurchaseHistoryListQuery_me_query_elineupMallPurchaseHistories$data;
  readonly " $fragmentSpreads": FragmentRefs<"ElineupMallPurchaseHistoryListQuery_me_query_elineupMallPurchaseHistories">;
};

const node: ReaderFragment = (function(){
var v0 = [
  "elineupMallPurchaseHistories"
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "after"
    },
    {
      "kind": "RootArgument",
      "name": "first"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": "first",
        "cursor": "after",
        "direction": "forward",
        "path": (v0/*: any*/)
      }
    ],
    "refetch": {
      "connection": {
        "forward": {
          "count": "first",
          "cursor": "after"
        },
        "backward": null,
        "path": (v0/*: any*/)
      },
      "fragmentPathInResult": [
        "node"
      ],
      "operation": require('./ElineupMallPurchaseHistoryListQueryFragmentQuery.graphql'),
      "identifierInfo": {
        "identifierField": "id",
        "identifierQueryVariableName": "id"
      }
    }
  },
  "name": "ElineupMallPurchaseHistoryListQuery_me_query_elineupMallPurchaseHistories",
  "selections": [
    {
      "alias": "elineupMallPurchaseHistories",
      "args": null,
      "concreteType": "HPElineupMallItemPurchaseHistoryConnection",
      "kind": "LinkedField",
      "name": "__ElineupMallPurchaseHistoryListQuery_me_query_elineupMallPurchaseHistories_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "HPElineupMallItemPurchaseHistoryEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "HPElineupMallItemPurchaseHistory",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                (v1/*: any*/),
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "ElineupMallPurchaseHistoryListItemFragment"
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
    (v1/*: any*/)
  ],
  "type": "MeQuery",
  "abstractKey": null
};
})();

(node as any).hash = "8651cefdb2f808f91848224151d9834c";

export default node;
