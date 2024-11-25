/**
 * @generated SignedSource<<e867fabafeab417fbaebc91195a8e863>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type PushNotificationSettingsContainerQuery$variables = {
  slug: string;
};
export type PushNotificationSettingsContainerQuery$data = {
  readonly me: {
    readonly id: string;
    readonly notificationSettings: ReadonlyArray<{
      readonly createdAt: string | null | undefined;
      readonly enableNewPosts: boolean;
      readonly enablePaymentDue: boolean;
      readonly enablePaymentStart: boolean;
      readonly id: string;
      readonly name: string;
      readonly slug: string;
      readonly token: string;
      readonly updatedAt: string | null | undefined;
    } | null | undefined> | null | undefined;
  };
};
export type PushNotificationSettingsContainerQuery = {
  response: PushNotificationSettingsContainerQuery$data;
  variables: PushNotificationSettingsContainerQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "slug"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "MeQuery",
    "kind": "LinkedField",
    "name": "me",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      {
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "slug",
            "variableName": "slug"
          }
        ],
        "concreteType": "UserNotificationSetting",
        "kind": "LinkedField",
        "name": "notificationSettings",
        "plural": true,
        "selections": [
          (v1/*: any*/),
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
            "kind": "ScalarField",
            "name": "updatedAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "slug",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "token",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "enableNewPosts",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "enablePaymentStart",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "enablePaymentDue",
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
    "name": "PushNotificationSettingsContainerQuery",
    "selections": (v2/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PushNotificationSettingsContainerQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "23d2302cb126171e87516230deb6f29c",
    "id": null,
    "metadata": {},
    "name": "PushNotificationSettingsContainerQuery",
    "operationKind": "query",
    "text": "query PushNotificationSettingsContainerQuery(\n  $slug: String!\n) {\n  me {\n    id\n    notificationSettings(slug: $slug) {\n      id\n      createdAt\n      updatedAt\n      slug\n      name\n      token\n      enableNewPosts\n      enablePaymentStart\n      enablePaymentDue\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "baf92b17f96aa5f6065b922fbe75b2b3";

export default node;
