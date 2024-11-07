/**
 * @generated SignedSource<<2d70e8bf4442b0cfb28a31a6255e068d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type FeedListItemViewHistoryIconFragment$data = {
  readonly myViewHistory: {
    readonly id: string;
    readonly isFavorite: boolean;
  } | null | undefined;
  readonly " $fragmentType": "FeedListItemViewHistoryIconFragment";
};
export type FeedListItemViewHistoryIconFragment$key = {
  readonly " $data"?: FeedListItemViewHistoryIconFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"FeedListItemViewHistoryIconFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "FeedListItemViewHistoryIconFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "HPViewHistory",
      "kind": "LinkedField",
      "name": "myViewHistory",
      "plural": false,
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
          "name": "isFavorite",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "HPFeedItem",
  "abstractKey": null
};

(node as any).hash = "b771a21d9260efe6b5bf7b30334c8521";

export default node;
