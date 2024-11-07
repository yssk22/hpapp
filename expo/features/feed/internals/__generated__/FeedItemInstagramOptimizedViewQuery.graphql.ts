/**
 * @generated SignedSource<<c4da7ad85abda6ce634eea59cf984d0f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type HPBlobType = "image" | "text" | "unknown" | "video" | "%future added value";
export type FeedItemInstagramOptimizedViewQuery$variables = {
  id: string;
};
export type FeedItemInstagramOptimizedViewQuery$data = {
  readonly node: {
    readonly description?: string;
    readonly id: string;
    readonly media?: ReadonlyArray<{
      readonly height: number;
      readonly thumbnailUrl: string;
      readonly type: HPBlobType;
      readonly url: string;
      readonly width: number;
    }>;
  } | null | undefined;
};
export type FeedItemInstagramOptimizedViewQuery = {
  response: FeedItemInstagramOptimizedViewQuery$data;
  variables: FeedItemInstagramOptimizedViewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Media",
      "kind": "LinkedField",
      "name": "media",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "url",
          "storageKey": null
        },
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
          "kind": "ScalarField",
          "name": "width",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "height",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "thumbnailUrl",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "HPIgPost",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "FeedItemInstagramOptimizedViewQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "FeedItemInstagramOptimizedViewQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          (v2/*: any*/),
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "c842c7b595703d624cbfe91d1480d8a5",
    "id": null,
    "metadata": {},
    "name": "FeedItemInstagramOptimizedViewQuery",
    "operationKind": "query",
    "text": "query FeedItemInstagramOptimizedViewQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    id\n    ... on HPIgPost {\n      description\n      media {\n        url\n        type\n        width\n        height\n        thumbnailUrl\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "3e928b2e9aecc5d9f08a02a7e231bcc8";

export default node;
