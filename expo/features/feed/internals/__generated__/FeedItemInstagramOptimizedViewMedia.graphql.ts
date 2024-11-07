/**
 * @generated SignedSource<<999bf77a3293bfeafa49cbfd2e488813>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type HPBlobType = "image" | "text" | "unknown" | "video" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type FeedItemInstagramOptimizedViewMedia$data = {
  readonly height: number;
  readonly type: HPBlobType;
  readonly url: string;
  readonly width: number;
  readonly " $fragmentType": "FeedItemInstagramOptimizedViewMedia";
};
export type FeedItemInstagramOptimizedViewMedia$key = {
  readonly " $data"?: FeedItemInstagramOptimizedViewMedia$data;
  readonly " $fragmentSpreads": FragmentRefs<"FeedItemInstagramOptimizedViewMedia">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "FeedItemInstagramOptimizedViewMedia",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "url",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "type",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "width",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "height",
      "storageKey": null
    }
  ],
  "type": "Media",
  "abstractKey": null
};

(node as any).hash = "09b3da3c33a869f874ed93f8af7f1a91";

export default node;
