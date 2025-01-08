/**
 * @generated SignedSource<<7f13dea9e7d37876bf99814e6698d387>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type FeedContextQuery_helloproject_query_feed$data = {
  readonly feed: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly myViewHistory: {
          readonly id: string;
        } | null | undefined;
        readonly postAt: string;
        readonly " $fragmentSpreads": FragmentRefs<"FeedListItemFragment">;
      } | null | undefined;
    } | null | undefined> | null | undefined;
  } | null | undefined;
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
      "identifierInfo": {
        "identifierField": "id",
        "identifierQueryVariableName": "id"
      }
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
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "postAt",
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
                    (v1/*: any*/)
                  ],
                  "storageKey": null
                },
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

(node as any).hash = "09e75fce56813c31599288536dca7c20";

export default node;
