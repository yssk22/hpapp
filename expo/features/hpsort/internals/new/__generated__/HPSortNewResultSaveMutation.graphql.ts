/**
 * @generated SignedSource<<80d790e39de776a64780c63247e51b0e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type HPSortHistoryCreateParamsInput = {
  records?: ReadonlyArray<HPSortResultRecordInput> | null | undefined;
};
export type HPSortResultRecordInput = {
  artistId: number;
  artistKey: string;
  memberId: number;
  memberKey: string;
  point?: number | null | undefined;
  rank?: number | null | undefined;
};
export type HPSortNewResultSaveMutation$variables = {
  input: HPSortHistoryCreateParamsInput;
};
export type HPSortNewResultSaveMutation$data = {
  readonly me: {
    readonly createSortHistory: {
      readonly createdAt: string | null | undefined;
      readonly id: string;
      readonly sortResult: {
        readonly records: ReadonlyArray<{
          readonly artistId: number;
          readonly memberId: number;
          readonly memberKey: string;
          readonly rank: number | null | undefined;
        }> | null | undefined;
      };
    } | null | undefined;
  } | null | undefined;
};
export type HPSortNewResultSaveMutation = {
  response: HPSortNewResultSaveMutation$data;
  variables: HPSortNewResultSaveMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "MeMutation",
    "kind": "LinkedField",
    "name": "me",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "params",
            "variableName": "input"
          }
        ],
        "concreteType": "HPSortHistory",
        "kind": "LinkedField",
        "name": "createSortHistory",
        "plural": false,
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "HPSortNewResultSaveMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "HPSortNewResultSaveMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "54b37c2625133fd3a420b68fd0f56167",
    "id": null,
    "metadata": {},
    "name": "HPSortNewResultSaveMutation",
    "operationKind": "mutation",
    "text": "mutation HPSortNewResultSaveMutation(\n  $input: HPSortHistoryCreateParamsInput!\n) {\n  me {\n    createSortHistory(params: $input) {\n      id\n      createdAt\n      sortResult {\n        records {\n          artistId\n          memberId\n          memberKey\n          rank\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "dbcff2ace713c2fbcc604ff2f3041cdc";

export default node;
