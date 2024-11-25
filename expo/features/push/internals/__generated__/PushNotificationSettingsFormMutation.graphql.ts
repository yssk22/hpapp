/**
 * @generated SignedSource<<640e458d65716845684e0f2d3c991977>>
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
export type PushNotificationSettingsFormMutation$variables = {
  params: NotificationSettingsInput;
  token: string;
};
export type PushNotificationSettingsFormMutation$data = {
  readonly me: {
    readonly upsertNotificationToken: {
      readonly enableNewPosts: boolean;
      readonly enablePaymentDue: boolean;
      readonly enablePaymentStart: boolean;
      readonly id: string;
      readonly name: string;
      readonly slug: string;
      readonly token: string;
    } | null | undefined;
  } | null | undefined;
};
export type PushNotificationSettingsFormMutation = {
  response: PushNotificationSettingsFormMutation$data;
  variables: PushNotificationSettingsFormMutation$variables;
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
    "name": "PushNotificationSettingsFormMutation",
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
    "name": "PushNotificationSettingsFormMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "cd6e42c2b07cd9a1fa343c779aa51d81",
    "id": null,
    "metadata": {},
    "name": "PushNotificationSettingsFormMutation",
    "operationKind": "mutation",
    "text": "mutation PushNotificationSettingsFormMutation(\n  $token: String!\n  $params: NotificationSettingsInput!\n) {\n  me {\n    upsertNotificationToken(token: $token, params: $params) {\n      id\n      token\n      slug\n      name\n      enableNewPosts\n      enablePaymentStart\n      enablePaymentDue\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "9b17b4c67fe84ca90fe383db651a4a81";

export default node;
