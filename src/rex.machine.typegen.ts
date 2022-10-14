// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "done.invoke.Rex.Refreshing auth token.Saving auth token:invocation[0]": {
      type: "done.invoke.Rex.Refreshing auth token.Saving auth token:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.queryAPI": {
      type: "done.invoke.queryAPI";
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
    "error.platform.Rex.Refreshing auth token.Saving auth token:invocation[0]": {
      type: "error.platform.Rex.Refreshing auth token.Saving auth token:invocation[0]";
      data: unknown;
    };
    "error.platform.queryAPI": {
      type: "error.platform.queryAPI";
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
    "Cache response": "done.invoke.Rex.Write response to cache:invocation[0]";
    "Check cache": "done.invoke.Rex.Checking cache:invocation[0]";
    "Query API": "done.invoke.queryAPI";
    "Read auth token": "done.invoke.readAuthToken";
    "Request auth token": "done.invoke.requestAuthToken";
    "Save auth token": "done.invoke.Rex.Refreshing auth token.Saving auth token:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    services: "Query API" | "Request auth token";
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    "Backup query config":
      | "done.invoke.readAuthToken"
      | "error.platform.queryAPI";
    "Clear refresh flag": "";
    "Clear token": "done.invoke.readAuthToken" | "error.platform.queryAPI";
    "Flag for caching": "" | "Cache miss";
    "Flag for refresh": "Flag cache for refresh";
    "Restore query config": "done.state.Rex.Refreshing auth token";
    "Save response": "Cache hit" | "done.invoke.queryAPI";
    "Set API error": "error.platform.queryAPI";
    "Set auth query config":
      | "done.invoke.readAuthToken"
      | "error.platform.queryAPI";
    "Set auth token":
      | "done.invoke.readAuthToken"
      | "done.invoke.requestAuthToken";
    "Set error no token received": "done.invoke.requestAuthToken";
    "Set error requesting token": "error.platform.requestAuthToken";
    "Set error saving token": "error.platform.Rex.Refreshing auth token.Saving auth token:invocation[0]";
    "Set error validating response": "error.platform.queryAPI";
    "Set invalid query error": "Query API";
    "Set query config": "Query API";
    "Set received invalid token error": "error.platform.queryAPI";
    "Set token refreshed flag": "done.invoke.Rex.Refreshing auth token.Saving auth token:invocation[0]";
  };
  eventsCausingServices: {
    "Cache response": "";
    "Check cache": "xstate.init";
    "Query API": "Query API" | "done.state.Rex.Refreshing auth token";
    "Read auth token": "" | "Cache miss";
    "Request auth token":
      | "done.invoke.readAuthToken"
      | "error.platform.queryAPI";
    "Save auth token": "done.invoke.requestAuthToken";
  };
  eventsCausingGuards: {
    "Errors have occured": "done.state.Rex.Refreshing auth token";
    "First invalid token error": "error.platform.queryAPI";
    "Flagged for caching": "";
    "Flagged for refresh": "";
    "Invalid response": "error.platform.queryAPI";
    "Query is valid": "Query API";
    "Received token": "done.invoke.requestAuthToken";
    "Second invalid token error": "error.platform.queryAPI";
    "Token found": "done.invoke.readAuthToken";
  };
  eventsCausingDelays: {};
  matchesStates:
    | "Checking cache"
    | "Complete"
    | "Error"
    | "Invalid query"
    | "Look for cached token"
    | "Querying API"
    | "Ready"
    | "Refreshing auth token"
    | "Refreshing auth token.Error"
    | "Refreshing auth token.Requesting auth token"
    | "Refreshing auth token.Saved"
    | "Refreshing auth token.Saving auth token"
    | "Write response to cache"
    | {
        "Refreshing auth token"?:
          | "Error"
          | "Requesting auth token"
          | "Saved"
          | "Saving auth token";
      };
  tags: never;
}
