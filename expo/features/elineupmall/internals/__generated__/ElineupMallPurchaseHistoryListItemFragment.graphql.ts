/**
 * @generated SignedSource<<0b199516ec622e98a3c2d0c8325e82c7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ElineupMallPurchaseHistoryListItemFragment$data = {
  readonly elineupMallItem: {
    readonly images: ReadonlyArray<{
      readonly thumbnailUrl: string;
      readonly url: string;
    }>;
  } | null | undefined;
  readonly id: string;
  readonly name: string;
  readonly num: number;
  readonly orderID: string;
  readonly orderedAt: string;
  readonly permalink: string;
  readonly price: number;
  readonly " $fragmentType": "ElineupMallPurchaseHistoryListItemFragment";
};
export type ElineupMallPurchaseHistoryListItemFragment$key = {
  readonly " $data"?: ElineupMallPurchaseHistoryListItemFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ElineupMallPurchaseHistoryListItemFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ElineupMallPurchaseHistoryListItemFragment",
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
      "name": "orderID",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "orderedAt",
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
      "name": "price",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "num",
      "storageKey": null
    },
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
      "concreteType": "HPElineupMallItem",
      "kind": "LinkedField",
      "name": "elineupMallItem",
      "plural": false,
      "selections": [
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
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "thumbnailUrl",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "HPElineupMallItemPurchaseHistory",
  "abstractKey": null
};

(node as any).hash = "95b1c1384a6d44b94af92ea40a44e943";

export default node;
