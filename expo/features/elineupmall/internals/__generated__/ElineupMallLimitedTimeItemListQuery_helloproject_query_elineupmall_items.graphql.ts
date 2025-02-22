/**
 * @generated SignedSource<<ac1f336b836fa2fec068f6c2b3df724c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ElineupMallLimitedTimeItemListQuery_helloproject_query_elineupmall_items$data = {
  readonly elineupMallItems: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly permalink: string;
        readonly " $fragmentSpreads": FragmentRefs<"ElineupMallLimitedTimeItemListItemFragment">;
      } | null | undefined;
    } | null | undefined> | null | undefined;
  } | null | undefined;
  readonly id: string;
  readonly " $fragmentType": "ElineupMallLimitedTimeItemListQuery_helloproject_query_elineupmall_items";
};
export type ElineupMallLimitedTimeItemListQuery_helloproject_query_elineupmall_items$key = {
  readonly " $data"?: ElineupMallLimitedTimeItemListQuery_helloproject_query_elineupmall_items$data;
  readonly " $fragmentSpreads": FragmentRefs<"ElineupMallLimitedTimeItemListQuery_helloproject_query_elineupmall_items">;
};

const node: ReaderFragment = (function(){
var v0 = [
  "elineupMallItems"
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
    },
    {
      "kind": "RootArgument",
      "name": "params"
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
      "operation": require('./ElineupMallLimitedTimeItemListQueryFragmentQuery.graphql'),
      "identifierInfo": {
        "identifierField": "id",
        "identifierQueryVariableName": "id"
      }
    }
  },
  "name": "ElineupMallLimitedTimeItemListQuery_helloproject_query_elineupmall_items",
  "selections": [
    {
      "alias": "elineupMallItems",
      "args": [
        {
          "kind": "Variable",
          "name": "params",
          "variableName": "params"
        }
      ],
      "concreteType": "HPElineupMallItemConnection",
      "kind": "LinkedField",
      "name": "__ElineupMallLimitedTimeItemListQuery_helloproject_query_elineupMallItems_connection",
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
                (v1/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "permalink",
                  "storageKey": null
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "ElineupMallLimitedTimeItemListItemFragment"
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
  "type": "HelloProjectQuery",
  "abstractKey": null
};
})();

(node as any).hash = "51b8104b42d9cf3b86c217b2478fc028";

export default node;
