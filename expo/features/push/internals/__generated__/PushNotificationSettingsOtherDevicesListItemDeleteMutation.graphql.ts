/**
 * @generated SignedSource<<4c65d391435601b270fbaaddd1638bfc>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type PushNotificationSettingsOtherDevicesListItemDeleteMutation$variables = {
  tokenId: number;
};
export type PushNotificationSettingsOtherDevicesListItemDeleteMutation$data = {
  readonly me: {
    readonly removeNotificationToken: {
      readonly id: string;
    } | null | undefined;
  } | null | undefined;
};
export type PushNotificationSettingsOtherDevicesListItemDeleteMutation = {
  response: PushNotificationSettingsOtherDevicesListItemDeleteMutation$data;
  variables: PushNotificationSettingsOtherDevicesListItemDeleteMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "tokenId"
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
            "name": "tokenId",
            "variableName": "tokenId"
          }
        ],
        "concreteType": "UserNotificationSetting",
        "kind": "LinkedField",
        "name": "removeNotificationToken",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
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
    "name": "PushNotificationSettingsOtherDevicesListItemDeleteMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PushNotificationSettingsOtherDevicesListItemDeleteMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ac198db19b5c6a4de9807f0572fa3882",
    "id": null,
    "metadata": {},
    "name": "PushNotificationSettingsOtherDevicesListItemDeleteMutation",
    "operationKind": "mutation",
    "text": "mutation PushNotificationSettingsOtherDevicesListItemDeleteMutation(\n  $tokenId: Int!\n) {\n  me {\n    removeNotificationToken(tokenId: $tokenId) {\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "33bf379650e31986252fb3a525c296bd";

export default node;
