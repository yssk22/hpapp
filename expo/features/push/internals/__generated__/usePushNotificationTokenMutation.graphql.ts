/**
 * @generated SignedSource<<585d4a9810b8f2370d4810022caa2a17>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type NotificationSettingsInput = {
  enableNewPosts?: boolean | null | undefined;
  enablePaymentDue?: boolean | null | undefined;
  enablePaymentStart?: boolean | null | undefined;
  name: string;
  slug: string;
};
export type usePushNotificationTokenMutation$variables = {
  params: NotificationSettingsInput;
  token: string;
};
export type usePushNotificationTokenMutation$data = {
  readonly me: {
    readonly upsertNotificationToken: {
      readonly createdAt: string | null | undefined;
      readonly enableNewPosts: boolean;
      readonly enablePaymentDue: boolean;
      readonly enablePaymentStart: boolean;
      readonly id: string;
      readonly name: string;
      readonly slug: string;
      readonly token: string;
      readonly updatedAt: string | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type usePushNotificationTokenMutation = {
  response: usePushNotificationTokenMutation$data;
  variables: usePushNotificationTokenMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "params"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "token"
},
v2 = [
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
            "variableName": "params"
          },
          {
            "kind": "Variable",
            "name": "token",
            "variableName": "token"
          }
        ],
        "concreteType": "UserNotificationSetting",
        "kind": "LinkedField",
        "name": "upsertNotificationToken",
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
            "kind": "ScalarField",
            "name": "updatedAt",
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "usePushNotificationTokenMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "usePushNotificationTokenMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "f4d588fdf51683523986a02e410a29aa",
    "id": null,
    "metadata": {},
    "name": "usePushNotificationTokenMutation",
    "operationKind": "mutation",
    "text": "mutation usePushNotificationTokenMutation(\n  $token: String!\n  $params: NotificationSettingsInput!\n) {\n  me {\n    upsertNotificationToken(token: $token, params: $params) {\n      id\n      createdAt\n      updatedAt\n      token\n      slug\n      name\n      enableNewPosts\n      enablePaymentStart\n      enablePaymentDue\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "a47c6732a754a1867143aa13d60d8b76";

export default node;
