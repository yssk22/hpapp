/**
 * @generated SignedSource<<e99e9bbf69ea0ca7d14c7cd67e6b0d4b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type HPSortHistoryListQuery_me_query_sortHistories$data = {
  readonly id: string;
  readonly sortHistories: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly createdAt: string | null | undefined;
        readonly id: string;
        readonly sortResult: {
          readonly records: ReadonlyArray<{
            readonly artistId: number;
            readonly memberId: number;
            readonly memberKey: string;
          }> | null | undefined;
        };
      } | null | undefined;
    } | null | undefined> | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "HPSortHistoryListQuery_me_query_sortHistories";
};
export type HPSortHistoryListQuery_me_query_sortHistories$key = {
  readonly " $data"?: HPSortHistoryListQuery_me_query_sortHistories$data;
  readonly " $fragmentSpreads": FragmentRefs<"HPSortHistoryListQuery_me_query_sortHistories">;
};

const node: ReaderFragment = (function(){
var v0 = [
  "sortHistories"
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
      "operation": require('./HPSortHistoryListQueryFragmentQuery.graphql'),
      "identifierInfo": {
        "identifierField": "id",
        "identifierQueryVariableName": "id"
      }
    }
  },
  "name": "HPSortHistoryListQuery_me_query_sortHistories",
  "selections": [
    {
      "alias": "sortHistories",
      "args": null,
      "concreteType": "HPSortHistoryConnection",
      "kind": "LinkedField",
      "name": "__HPSortHistoryListQuery_me_query_sortHistories_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "HPSortHistoryEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "HPSortHistory",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                (v1/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "createdAt",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "HPSortResult",
                  "kind": "LinkedField",
                  "name": "sortResult",
                  "plural": false,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "HPSortResultRecord",
                      "kind": "LinkedField",
                      "name": "records",
                      "plural": true,
                      "selections": [
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "artistId",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "memberId",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "memberKey",
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

(node as any).hash = "dabcb42a91227a53353f171eb1a1f230";

export default node;
