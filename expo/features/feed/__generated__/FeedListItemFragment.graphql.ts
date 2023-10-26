/**
 * @generated SignedSource<<6b957c316d972596acb53c00802c2df4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type HPFeedItemHPAssetType = "ameblo" | "elineupmall" | "instagram" | "tiktok" | "twitter" | "youtube" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type FeedListItemFragment$data = {
  readonly assetType: HPFeedItemHPAssetType;
  readonly id: string;
  readonly imageURL: string | null;
  readonly ownerMember: {
    readonly id: string;
  } | null;
  readonly postAt: string;
  readonly sourceID: number;
  readonly sourceURL: string;
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
};
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
      "selections": [
        (v0/*: any*/)
      ],
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

(node as any).hash = "6b375a3caabd3a62a7f967e8409b71e5";

export default node;
