/**
 * @generated SignedSource<<e34d45d29949052f58b210b9b09192aa>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type HelloProjectFragment$data = {
  readonly artists: ReadonlyArray<{
    readonly id: string;
    readonly key: string;
    readonly members: ReadonlyArray<{
      readonly artistID: string | null | undefined;
      readonly artistKey: string;
      readonly bloodType: string;
      readonly dateOfBirth: string;
      readonly graduateAt: string | null | undefined;
      readonly id: string;
      readonly joinAt: string | null | undefined;
      readonly key: string;
      readonly name: string;
      readonly nameKana: string;
      readonly thumbnailURL: string;
    }> | null | undefined;
    readonly name: string;
    readonly thumbnailURL: string;
  } | null | undefined> | null | undefined;
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
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "artistID",
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

(node as any).hash = "92d091cdf617646cc1e8aa9e685bf157";

export default node;
