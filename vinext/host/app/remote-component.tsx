"use client";

import * as React from "react";
import { type ComponentType } from "react";
import { getVinextReact } from "vinext/client";

type RemoteModule = { default?: ComponentType | null };

type RemoteComponentState = {
  error: string | null;
  RemoteComponent: ComponentType | null;
};

const react = getVinextReact(React);

// Start the federated fetches as soon as the client bundle evaluates, in
// parallel with host hydration, instead of waiting for a post-hydration
// effect. vinext's Module Federation bridge is browser-only, so the server
// render must never touch the remote entry.
const remoteLoads: Record<string, Promise<RemoteModule>> | null =
  typeof window === "undefined"
    ? null
    : {
        // @ts-ignore
        "remote/Widget": import("remote/Widget"),
        // @ts-ignore
        "remote/Counter": import("remote/Counter"),
      };

function createRemoteComponent(label: string) {
  return function RemoteComponent() {
    const [state, setState] = react.useState<RemoteComponentState>({
      error: null,
      RemoteComponent: null,
    });

    react.useEffect(() => {
      let cancelled = false;
      const load = remoteLoads?.[label];
      if (!load) {
        return;
      }

      void load
        .then((module) => {
          const RemoteModule = module.default;
          if (!RemoteModule) {
            throw new Error(`Remote module ${label} did not expose a default component.`);
          }
          return RemoteModule;
        })
        .then((RemoteModule) => {
          if (!cancelled) {
            setState({ error: null, RemoteComponent: RemoteModule });
          }
        })
        .catch((loadError) => {
          if (!cancelled) {
            setState({
              error: loadError instanceof Error ? loadError.message : String(loadError),
              RemoteComponent: null,
            });
          }
        });

      return () => {
        cancelled = true;
      };
    }, [setState]);

    if (state.error) {
      return (
        <div
          style={{
            background: "#4b1f1f",
            borderRadius: "10px",
            color: "white",
            maxWidth: "260px",
            padding: "20px",
          }}
        >
          Failed to load {label}: {state.error}
        </div>
      );
    }

    const { RemoteComponent } = state;
    return RemoteComponent ? <RemoteComponent /> : null;
  };
}

export const RemoteWidget = createRemoteComponent("remote/Widget");
export const RemoteCounter = createRemoteComponent("remote/Counter");
