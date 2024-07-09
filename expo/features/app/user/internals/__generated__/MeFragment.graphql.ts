/**
 * @generated SignedSource<<497ca03b6fd1b232e7c9c1a8920b43e7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type HPFollowHPFollowType = "follow" | "follow_with_notification" | "unfollow" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type MeFragment$data = {
  readonly clientId: string | null;
  readonly clientName: string | null;
  readonly followings: ReadonlyArray<{
    readonly member: {
      readonly id: string;
    };
    readonly type: HPFollowHPFollowType;
  } | null> | null;
  readonly id: string;
  readonly sortHistories: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly createdAt: string | null;
        readonly id: string;
        readonly sortResult: {
          readonly records: ReadonlyArray<{
            readonly artistId: number;
            readonly memberId: number;
            readonly memberKey: string;
          }> | null;
        };
      } | null;
    } | null> | null;
  } | null;
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
      "args": null,
      "concreteType": "HPFollow",
      "kind": "LinkedField",
      "name": "followings",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "type",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "HPMember",
          "kind": "LinkedField",
          "name": "member",
          "plural": false,
          "selections": [
            (v0/*: any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 1
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
      "storageKey": "sortHistories(first:1)"
    }
  ],
  "type": "MeQuery",
  "abstractKey": null
};
})();

(node as any).hash = "4d32362d96980716113c84f591743ecd";

export default node;
