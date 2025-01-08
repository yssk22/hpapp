/**
 * @generated SignedSource<<612b7afdfc6893790ba5d9fec45afd4a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ElineupMallPurchaseHistoryListItem$data = {
  readonly elineupMallItem: {
    readonly images: ReadonlyArray<{
      readonly thumbnailUrl: string;
      readonly url: string;
    }>;
  } | null | undefined;
  readonly id: string;
  readonly name: string;
  readonly orderID: string;
  readonly orderedAt: string;
  readonly permalink: string;
  readonly price: number;
  readonly " $fragmentType": "ElineupMallPurchaseHistoryListItem";
};
export type ElineupMallPurchaseHistoryListItem$key = {
  readonly " $data"?: ElineupMallPurchaseHistoryListItem$data;
  readonly " $fragmentSpreads": FragmentRefs<"ElineupMallPurchaseHistoryListItem">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ElineupMallPurchaseHistoryListItem",
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

(node as any).hash = "f0dc3828f5651ee8c69a6bd89d1e65fd";

export default node;
