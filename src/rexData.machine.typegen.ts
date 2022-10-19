// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "done.invoke.cacheResponse": {
      type: "done.invoke.cacheResponse";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.checkCache": {
      type: "done.invoke.checkCache";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.queryAPI": {
      type: "done.invoke.queryAPI";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.cacheResponse": {
      type: "error.platform.cacheResponse";
      data: unknown;
    };
    "error.platform.checkCache": {
      type: "error.platform.checkCache";
      data: unknown;
    };
    "error.platform.queryAPI": {
      type: "error.platform.queryAPI";
      data: unknown;
    };
    "xstate.after(500)#Rex Data.Checking for token.Waiting": {
      type: "xstate.after(500)#Rex Data.Checking for token.Waiting";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    "Cache response": "done.invoke.cacheResponse";
    "Check cache for response": "done.invoke.checkCache";
    "Query API": "done.invoke.queryAPI";
  };
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    "Flag for caching": "" | "Skip cache";
    "Flag for refresh": "Cache hit";
    "Flag token as refreshed": "Renew expired token";
    "Log error message": "Handle error";
    "Prepare auth token": "xstate.init";
    "Refresh token": "Renew expired token";
    "Remove flag for refresh": "";
    "Request token": "";
    "Save result": "Cache hit" | "Handle response";
    "Set API error": "Handle error";
    "Set invalid payload error": "Call API";
    "Set invalid route error": "Call API";
    "Set query params": "Call API";
  };
  eventsCausingServices: {
    "Cache response": "";
    "Check cache for response": "Call API";
    "Query API": "done.state.Rex Data.Checking for token";
  };
  eventsCausingGuards: {
    "Cache is stale": "Cache hit";
    "Flagged for caching": "";
    "Flagged for refresh": "";
    "Has auth token":
      | ""
      | "xstate.after(500)#Rex Data.Checking for token.Waiting";
    "Invalid payload": "Call API";
    "Invalid route": "Call API";
  };
  eventsCausingDelays: {};
  matchesStates:
    | "Checking cache for response"
    | "Checking for token"
    | "Checking for token.Checking"
    | "Checking for token.Ready"
    | "Checking for token.Waiting"
    | "Error"
    | "Idle"
    | "Received response"
    | "Received response.Cache response"
    | "Received response.Done"
    | "Received response.Save response"
    | "Request data"
    | {
        "Checking for token"?: "Checking" | "Ready" | "Waiting";
        "Received response"?: "Cache response" | "Done" | "Save response";
      };
  tags: never;
}
