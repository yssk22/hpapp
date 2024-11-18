/**
 * @generated SignedSource<<78d27c9842b112835fb6f52df9e45926>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type HPElineupMallItemHPElineupMallItemCategory = "Blueray" | "ClearFile" | "ColllectionOther" | "ColllectionPhoto" | "ColllectionPinnapPoster" | "DVD" | "DVDMagazine" | "DVDMagazineOther" | "FSK" | "KeyringOther" | "MicrofiberTowel" | "MufflerTowel" | "Other" | "Penlight" | "Photo2L" | "PhotoA4" | "PhotoA5" | "PhotoAlbum" | "PhotoAlbumOther" | "PhotoBook" | "PhotoBookOther" | "PhotoDaily" | "PhotoOther" | "TShirt" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type ElineupMallLimitedTimeItemListItemFragment$data = {
  readonly category: HPElineupMallItemHPElineupMallItemCategory;
  readonly description: string;
  readonly id: string;
  readonly images: ReadonlyArray<{
    readonly url: string;
  }>;
  readonly isLimitedToFc: boolean;
  readonly isOutOfStock: boolean;
  readonly name: string;
  readonly orderEndAt: string | null | undefined;
  readonly orderStartAt: string | null | undefined;
  readonly permalink: string;
  readonly price: number;
  readonly " $fragmentType": "ElineupMallLimitedTimeItemListItemFragment";
};
export type ElineupMallLimitedTimeItemListItemFragment$key = {
  readonly " $data"?: ElineupMallLimitedTimeItemListItemFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"ElineupMallLimitedTimeItemListItemFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ElineupMallLimitedTimeItemListItemFragment",
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
      "name": "name",
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
      "kind": "ScalarField",
      "name": "description",
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
      "name": "isLimitedToFc",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isOutOfStock",
      "storageKey": null
    },
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
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "category",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "orderStartAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "orderEndAt",
      "storageKey": null
    }
  ],
  "type": "HPElineupMallItem",
  "abstractKey": null
};

(node as any).hash = "5d089435754d9935f0205aaf83157999";

export default node;
