/**
 * @generated SignedSource<<9e8d4833f79b4d65b5aec519d8520db9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type HelloProjectFragment$data = {
  readonly artists: ReadonlyArray<{
    readonly id: string;
    readonly key: string;
    readonly members: ReadonlyArray<{
      readonly artistKey: string;
      readonly bloodType: string;
      readonly dateOfBirth: string;
      readonly graduateAt: string | null;
      readonly id: string;
      readonly joinAt: string | null;
      readonly key: string;
      readonly name: string;
      readonly nameKana: string;
      readonly thumbnailURL: string;
    }> | null;
    readonly name: string;
    readonly thumbnailURL: string;
  } | null> | null;
  readonly " $fragmentType": "HelloProjectFragment";
};
export type HelloProjectFragment$key = {
  readonly " $data"?: HelloProjectFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"HelloProjectFragment">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "key",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "thumbnailURL",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "HelloProjectFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "HPArtist",
      "kind": "LinkedField",
      "name": "artists",
      "plural": true,
      "selections": [
        (v0/*: any*/),
        (v1/*: any*/),
        (v2/*: any*/),
        (v3/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "HPMember",
          "kind": "LinkedField",
          "name": "members",
          "plural": true,
          "selections": [
            (v0/*: any*/),
            (v1/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "artistKey",
              "storageKey": null
            },
            (v2/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "nameKana",
              "storageKey": null
            },
            (v3/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "dateOfBirth",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "bloodType",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "joinAt",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "graduateAt",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "HelloProjectQuery",
  "abstractKey": null
};
})();

(node as any).hash = "abae7e2737b1aa2e79b5fdec4bc787ef";

export default node;