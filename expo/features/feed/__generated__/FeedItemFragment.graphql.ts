/**
 * @generated SignedSource<<5939e557657126fcaf756a7c7e7d0856>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type HPFeedItemHPAssetType = "ameblo" | "elineupmall" | "instagram" | "tiktok" | "twitter" | "youtube" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type FeedItemFragment$data = {
  readonly assetType: HPFeedItemHPAssetType;
  readonly id: string;
  readonly imageURL: string | null;
  readonly myViewHistory: {
    readonly id: string;
    readonly isFavorite: boolean;
  } | null;
  readonly ownerMember: {
    readonly id: string;
    readonly key: string;
  } | null;
  readonly postAt: string;
  readonly sourceID: number;
  readonly sourceURL: string;
  readonly taggedMembers: ReadonlyArray<{
    readonly id: string;
    readonly key: string;
  }> | null;
  readonly title: string;
  readonly " $fragmentType": "FeedItemFragment";
};
export type FeedItemFragment$key = {
  readonly " $data"?: FeedItemFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"FeedItemFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = [
  (v0/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "key",
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "FeedItemFragment",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "title",
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
      "kind": "ScalarField",
      "name": "sourceURL",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "imageURL",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "assetType",
      "storageKey": null
    },
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
      "concreteType": "HPMember",
      "kind": "LinkedField",
      "name": "ownerMember",
      "plural": false,
      "selections": (v1/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "HPMember",
      "kind": "LinkedField",
      "name": "taggedMembers",
      "plural": true,
      "selections": (v1/*: any*/),
      "storageKey": null
    },
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
            (v0/*: any*/),
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
})();

(node as any).hash = "af1b6f16efca9e8c086cc91246a625e7";

export default node;
