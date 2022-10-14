// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.Rex query.Querying API:invocation[0]": {
      type: "done.invoke.Rex query.Querying API:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.Rex query.Refreshing auth token.Saving auth token:invocation[0]": {
      type: "done.invoke.Rex query.Refreshing auth token.Saving auth token:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.readAuthToken": {
      type: "done.invoke.readAuthToken";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.requestAuthToken": {
      type: "done.invoke.requestAuthToken";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.Rex query.Querying API:invocation[0]": {
      type: "error.platform.Rex query.Querying API:invocation[0]";
      data: unknown;
    };
    "error.platform.Rex query.Refreshing auth token.Saving auth token:invocation[0]": {
      type: "error.platform.Rex query.Refreshing auth token.Saving auth token:invocation[0]";
      data: unknown;
    };
    "error.platform.readAuthToken": {
      type: "error.platform.readAuthToken";
      data: unknown;
    };
    "error.platform.requestAuthToken": {
      type: "error.platform.requestAuthToken";
      data: unknown;
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    "Read auth token": "done.invoke.readAuthToken";
    "Request auth token": "done.invoke.requestAuthToken";
    "Save auth token": "done.invoke.Rex query.Refreshing auth token.Saving auth token:invocation[0]";
    queryAPI: "done.invoke.Rex query.Querying API:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    services:
      | "queryAPI"
      | "Request auth token"
      | "Save auth token"
      | "Read auth token";
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    "Return error response":
      | "Query API"
      | "error.platform.Rex query.Querying API:invocation[0]"
      | "error.platform.Rex query.Refreshing auth token.Saving auth token:invocation[0]"
      | "error.platform.requestAuthToken";
    "Return response": "done.invoke.Rex query.Querying API:invocation[0]";
    "Set API error": "error.platform.Rex query.Querying API:invocation[0]";
    "Set auth token": "done.invoke.requestAuthToken";
    "Set error requesting token": "error.platform.requestAuthToken";
    "Set error saving token": "error.platform.Rex query.Refreshing auth token.Saving auth token:invocation[0]";
    "Set invalid query error": "Query API";
    "Set query config": "Query API";
    "Set received invalid token error": "error.platform.Rex query.Querying API:invocation[0]";
    "Set token refreshed flag": "done.invoke.Rex query.Refreshing auth token.Saving auth token:invocation[0]";
  };
  eventsCausingServices: {
    "Read auth token": "Query API";
    "Request auth token":
      | "done.invoke.readAuthToken"
      | "error.platform.Rex query.Querying API:invocation[0]";
    "Save auth token": "done.invoke.requestAuthToken";
    queryAPI:
      | "done.invoke.Rex query.Refreshing auth token.Saving auth token:invocation[0]"
      | "done.invoke.readAuthToken";
  };
  eventsCausingGuards: {
    "First invalid token error": "error.platform.Rex query.Querying API:invocation[0]";
    "Query type is valid": "Query API";
    "Second invalid token error": "error.platform.Rex query.Querying API:invocation[0]";
    "Token found": "done.invoke.readAuthToken";
  };
  eventsCausingDelays: {};
  matchesStates:
    | "Complete"
    | "Error"
    | "Invalid query"
    | "Querying API"
    | "Reading auth token"
    | "Ready"
    | "Refreshing auth token"
    | "Refreshing auth token.Requesting auth token"
    | "Refreshing auth token.Saving auth token"
    | {
        "Refreshing auth token"?: "Requesting auth token" | "Saving auth token";
      };
  tags: never;
}
