/**
 * @generated SignedSource<<643d0bdd9d5330d0de6e697baaa8a804>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type HPFeedItemHPAssetType = "ameblo" | "elineupmall" | "instagram" | "tiktok" | "twitter" | "youtube" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type FeedListItemFragment$data = {
  readonly assetType: HPFeedItemHPAssetType;
  readonly id: string;
  readonly imageURL: string | null | undefined;
  readonly ownerMember: {
    readonly id: string;
    readonly key: string;
  } | null | undefined;
  readonly postAt: string;
  readonly sourceID: number;
  readonly sourceURL: string;
  readonly taggedMembers: ReadonlyArray<{
    readonly id: string;
    readonly key: string;
  }> | null | undefined;
  readonly title: string;
  readonly " $fragmentSpreads": FragmentRefs<"FeedListItemViewHistoryIconFragment">;
  readonly " $fragmentType": "FeedListItemFragment";
};
export type FeedListItemFragment$key = {
  readonly " $data"?: FeedListItemFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"FeedListItemFragment">;
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
  "name": "FeedListItemFragment",
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
      "args": null,
      "kind": "FragmentSpread",
      "name": "FeedListItemViewHistoryIconFragment"
    }
  ],
  "type": "HPFeedItem",
  "abstractKey": null
};
})();

(node as any).hash = "d54fab5bf167a458740ef1e842ea1ca5";

export default node;
