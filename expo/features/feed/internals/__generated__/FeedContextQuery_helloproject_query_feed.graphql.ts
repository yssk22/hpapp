/**
 * @generated SignedSource<<416932390cff358a0f0d66d0006f02da>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type FeedContextQuery_helloproject_query_feed$data = {
  readonly feed: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly " $fragmentSpreads": FragmentRefs<"FeedListItemFragment">;
      } | null;
    } | null> | null;
  } | null;
  readonly id: string;
  readonly " $fragmentType": "FeedContextQuery_helloproject_query_feed";
};
export type FeedContextQuery_helloproject_query_feed$key = {
  readonly " $data"?: FeedContextQuery_helloproject_query_feed$data;
  readonly " $fragmentSpreads": FragmentRefs<"FeedContextQuery_helloproject_query_feed">;
};

const node: ReaderFragment = (function(){
var v0 = [
  "feed"
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
      "operation": require('./FeedContextQueryFragmentQuery.graphql'),
      "identifierField": "id"
    }
  },
  "name": "FeedContextQuery_helloproject_query_feed",
  "selections": [
    {
      "alias": "feed",
      "args": [
        {
          "kind": "Variable",
          "name": "params",
          "variableName": "params"
        }
      ],
      "concreteType": "HPFeedItemConnection",
      "kind": "LinkedField",
      "name": "__FeedContextQuery_helloproject_query_feed_connection",
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
                (v1/*: any*/),
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "FeedListItemFragment"
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

(node as any).hash = "8086d44e7fab8a475bc632ea014a3594";

export default node;
