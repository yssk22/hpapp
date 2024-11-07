/**
 * @generated SignedSource<<634ce98e9fefec12e339252551367e58>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type FeedItemInstagramOptimizedView$data = {
  readonly id: string;
  readonly media: ReadonlyArray<{
    readonly " $fragmentSpreads": FragmentRefs<"FeedItemInstagramOptimizedViewMedia">;
  }>;
  readonly sourceID: number;
  readonly " $fragmentType": "FeedItemInstagramOptimizedView";
};
export type FeedItemInstagramOptimizedView$key = {
  readonly " $data"?: FeedItemInstagramOptimizedView$data;
  readonly " $fragmentSpreads": FragmentRefs<"FeedItemInstagramOptimizedView">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "FeedItemInstagramOptimizedView",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
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
      "concreteType": "Media",
      "kind": "LinkedField",
      "name": "media",
      "plural": true,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "FeedItemInstagramOptimizedViewMedia"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "HPFeedItem",
  "abstractKey": null
};

(node as any).hash = "c8d8d6e54b2ac88f1c00ffd2876c224b";

export default node;
