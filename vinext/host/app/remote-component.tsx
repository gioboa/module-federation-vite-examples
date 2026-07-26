"use client";

import * as React from "react";
import type { ComponentType } from "react";

type RemoteModule = { default: ComponentType };

const react = React;

const LazyRemoteWidget = react.lazy(
  () =>
    // @ts-expect-error Module Federation provides this virtual module.
    import("remote/Widget") as Promise<RemoteModule>
);
const LazyRemoteCounter = react.lazy(
  () =>
    // @ts-expect-error Module Federation provides this virtual module.
    import("remote/Counter") as Promise<RemoteModule>
);

export function RemoteWidget() {
  return (
    <react.Suspense fallback={<RemoteLoading label="remote/Widget" />}>
      <RemoteWidgetInner />
    </react.Suspense>
  );
}

function RemoteWidgetInner() {
  return <LazyRemoteWidget />;
}

export function RemoteCounter() {
  return (
    <react.Suspense fallback={<RemoteLoading label="remote/Counter" />}>
      <RemoteCounterInner />
    </react.Suspense>
  );
}

function RemoteCounterInner() {
  return <LazyRemoteCounter />;
}

function RemoteLoading({ label }: { label: string }) {
  return (
    <div
      style={{
        background: "#2b2d31",
        borderRadius: "10px",
        color: "white",
        padding: "20px",
        width: "225px",
      }}
    >
      Loading {label}…
    </div>
  );
}
