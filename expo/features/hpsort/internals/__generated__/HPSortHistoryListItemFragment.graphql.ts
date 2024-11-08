/**
 * @generated SignedSource<<c9410e10ed715a961f0bb58f2448ca02>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type HPSortHistoryListItemFragment$data = {
  readonly createdAt: string | null | undefined;
  readonly id: string;
  readonly sortResult: {
    readonly records: ReadonlyArray<{
      readonly artistId: number;
      readonly memberId: number;
      readonly memberKey: string;
    }> | null | undefined;
  };
  readonly " $fragmentType": "HPSortHistoryListItemFragment";
};
export type HPSortHistoryListItemFragment$key = {
  readonly " $data"?: HPSortHistoryListItemFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"HPSortHistoryListItemFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "HPSortHistoryListItemFragment",
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
  "type": "HPSortHistory",
  "abstractKey": null
};

(node as any).hash = "f13a4e92e386ab59f5a1d482779f734a";

export default node;
