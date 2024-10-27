/**
 * @generated SignedSource<<583376a13fd295513aa6da613a315208>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type FeedItemCTALove$data = {
  readonly id: string;
  readonly myViewHistory: {
    readonly id: string;
    readonly isFavorite: boolean;
  } | null;
  readonly " $fragmentType": "FeedItemCTALove";
};
export type FeedItemCTALove$key = {
  readonly " $data"?: FeedItemCTALove$data;
  readonly " $fragmentSpreads": FragmentRefs<"FeedItemCTALove">;
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
  "name": "FeedItemCTALove",
  "selections": [
    (v0/*: any*/),
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
  ],
  "type": "HPFeedItem",
  "abstractKey": null
};
})();

(node as any).hash = "c59c267a0482f4f963cf96f19f964a57";

export default node;
