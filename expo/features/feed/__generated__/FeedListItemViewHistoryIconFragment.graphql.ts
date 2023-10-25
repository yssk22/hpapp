/**
 * @generated SignedSource<<f842443b25fb94d7b1867c2bc420a067>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type FeedListItemViewHistoryIconFragment$data = {
  readonly myViewHistory: {
    readonly id: string;
    readonly isFavorite: boolean;
  } | null;
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
      "kind": "ClientExtension",
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
      ]
    }
  ],
  "type": "HPFeedItem",
  "abstractKey": null
};

(node as any).hash = "b771a21d9260efe6b5bf7b30334c8521";

export default node;
