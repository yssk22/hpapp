/**
 * @generated SignedSource<<b116463829ad705e40c66083f34a2334>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type HPFCEventTicketApplicationSite = "hello_project" | "m_line" | "%future added value";
export type HPFCEventTicketApplicationStatus = "before_lottery" | "completed" | "payment_overdue" | "pending_payment" | "rejected" | "submitted" | "unknown" | "%future added value";
export type HPFCEventTicketApplicationUpsertParamsInput = {
  applications?: ReadonlyArray<HPFCEventTicketApplicationInput> | null | undefined;
  userId: number;
};
export type HPFCEventTicketApplicationInput = {
  applicationDueDate?: string | null | undefined;
  applicationId?: string | null | undefined;
  applicationSite: HPFCEventTicketApplicationSite;
  applicationStartDate?: string | null | undefined;
  fullyQualifiedVenueName: string;
  memberSha256: string;
  num: number;
  openAt?: string | null | undefined;
  paymentDueDate?: string | null | undefined;
  paymentStartDate?: string | null | undefined;
  startAt: string;
  status: HPFCEventTicketApplicationStatus;
  title: string;
};
export type useUPFCEventApplicationsUpsertMutation$variables = {
  params: HPFCEventTicketApplicationUpsertParamsInput;
};
export type useUPFCEventApplicationsUpsertMutation$data = {
  readonly me: {
    readonly upsertEvents: ReadonlyArray<{
      readonly id: string;
    } | null | undefined> | null | undefined;
  } | null | undefined;
};
export type useUPFCEventApplicationsUpsertMutation = {
  response: useUPFCEventApplicationsUpsertMutation$data;
  variables: useUPFCEventApplicationsUpsertMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "params"
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
            "variableName": "params"
          }
        ],
        "concreteType": "HPEvent",
        "kind": "LinkedField",
        "name": "upsertEvents",
        "plural": true,
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
    "name": "useUPFCEventApplicationsUpsertMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useUPFCEventApplicationsUpsertMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "89b4c4870a275f1f0be7036cb8a42d27",
    "id": null,
    "metadata": {},
    "name": "useUPFCEventApplicationsUpsertMutation",
    "operationKind": "mutation",
    "text": "mutation useUPFCEventApplicationsUpsertMutation(\n  $params: HPFCEventTicketApplicationUpsertParamsInput!\n) {\n  me {\n    upsertEvents(params: $params) {\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "b6f22417229675ca9e9d32b34b0e83d8";

export default node;
