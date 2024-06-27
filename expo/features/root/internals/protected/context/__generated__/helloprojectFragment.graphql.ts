/**
 * @generated SignedSource<<672094d9ed60454c6de6a94332ee9fec>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type helloprojectFragment$data = {
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
  readonly " $fragmentType": "helloprojectFragment";
};
export type helloprojectFragment$key = {
  readonly " $data"?: helloprojectFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"helloprojectFragment">;
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
  "name": "helloprojectFragment",
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

(node as any).hash = "4744a8f6dac91e111b624301efe04800";

export default node;
