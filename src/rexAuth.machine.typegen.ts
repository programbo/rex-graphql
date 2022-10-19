// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "done.invoke.cacheToken": {
      type: "done.invoke.cacheToken";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.checkCache": {
      type: "done.invoke.checkCache";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.requestAuthToken": {
      type: "done.invoke.requestAuthToken";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.cacheToken": {
      type: "error.platform.cacheToken";
      data: unknown;
    };
    "error.platform.checkCache": {
      type: "error.platform.checkCache";
      data: unknown;
    };
    "error.platform.requestAuthToken": {
      type: "error.platform.requestAuthToken";
      data: unknown;
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    "Cache token": "done.invoke.cacheToken";
    "Check cache for token": "done.invoke.checkCache";
    "Request auth token": "done.invoke.requestAuthToken";
  };
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    "Clear token": "Refresh token";
    "Flag from cache": "done.invoke.checkCache";
    "Report error":
      | "done.invoke.requestAuthToken"
      | "error.platform.checkCache"
      | "error.platform.requestAuthToken";
    "Save token": "done.invoke.checkCache" | "done.invoke.requestAuthToken";
    "Set error caching token": "error.platform.cacheToken";
    "Set error no token received": "done.invoke.requestAuthToken";
    "Set error requesting token": "error.platform.requestAuthToken";
    "Update parent":
      | ""
      | "Refresh token"
      | "done.invoke.cacheToken"
      | "done.invoke.checkCache"
      | "done.invoke.requestAuthToken"
      | "error.platform.cacheToken"
      | "error.platform.checkCache"
      | "error.platform.requestAuthToken";
  };
  eventsCausingServices: {
    "Cache token": "";
    "Check cache for token": "xstate.init";
    "Request auth token":
      | "Refresh token"
      | "done.invoke.checkCache"
      | "error.platform.checkCache";
  };
  eventsCausingGuards: {
    "Credentials defined": "error.platform.checkCache";
    "Found token": "done.invoke.checkCache";
    "New token": "";
    "Received token": "done.invoke.requestAuthToken";
  };
  eventsCausingDelays: {};
  matchesStates:
    | "Acquired token"
    | "Acquired token.Done"
    | "Acquired token.Save token"
    | "Acquired token.Saving token to cache"
    | "Check for cached token"
    | "Error"
    | "Requesting new token"
    | { "Acquired token"?: "Done" | "Save token" | "Saving token to cache" };
  tags: never;
}
