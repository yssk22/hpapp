/**
 * @generated SignedSource<<bc649cf1e726131d0ad23ee10e075e36>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MeFragment$data = {
  readonly clientId: string | null | undefined;
  readonly clientName: string | null | undefined;
  readonly id: string;
  readonly sortHistories: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly createdAt: string | null | undefined;
        readonly id: string;
        readonly sortResult: {
          readonly records: ReadonlyArray<{
            readonly artistId: number;
            readonly memberId: number;
            readonly memberKey: string;
            readonly point: number | null | undefined;
            readonly rank: number | null | undefined;
          }> | null | undefined;
        };
      } | null | undefined;
    } | null | undefined> | null | undefined;
  } | null | undefined;
  readonly username: string;
  readonly " $fragmentType": "MeFragment";
};
export type MeFragment$key = {
  readonly " $data"?: MeFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"MeFragment">;
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
  "name": "MeFragment",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "username",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "clientId",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "clientName",
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 2
        }
      ],
      "concreteType": "HPSortHistoryConnection",
      "kind": "LinkedField",
      "name": "sortHistories",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "HPSortHistoryEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "HPSortHistory",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                (v0/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "createdAt",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "HPSortResult",
                  "kind": "LinkedField",
                  "name": "sortResult",
                  "plural": false,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "HPSortResultRecord",
                      "kind": "LinkedField",
                      "name": "records",
                      "plural": true,
                      "selections": [
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "artistId",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "memberId",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "memberKey",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "point",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "rank",
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "sortHistories(first:2)"
    }
  ],
  "type": "MeQuery",
  "abstractKey": null
};
})();

(node as any).hash = "7d8ed18a69d3352164aa5e2d3fed4eb9";

export default node;
