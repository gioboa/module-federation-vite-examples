import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Component, lazy, Suspense, useEffect, useState } from "react";

import { loadRemoteModule } from "../mf/load-remote";

// `remote` is not in the plugin's `remotes`: it is registered at runtime and
// loaded through loadRemote on both server and client (see src/mf).
const RemoteWidget = lazy(() => loadRemoteModule("remote/Widget"));
const RemoteCounter = lazy(() => loadRemoteModule("remote/Counter"));

// Resolve the remote modules before render so the server instance has them
// when React.lazy is reached and the HTML includes the remote markup.
export const Route = createFileRoute("/")({
  loader: () =>
    Promise.all([loadRemoteModule("remote/Widget"), loadRemoteModule("remote/Counter")]).then(
      () => null
    ),
  component: IndexPage,
});

class RemoteErrorBoundary extends Component<
  { name: string; children: ReactNode },
  { error: Error | null }
> {
  state = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            background: "#2a1f21",
            border: "1px solid #8f3a3a",
            borderRadius: 5,
            boxShadow: "0 0 20px rgba(0, 0, 0, 0.25)",
            color: "white",
            margin: 20,
            padding: 20,
            width: 250,
          }}
        >
          <strong style={{ color: "#ffb4b4" }}>{this.props.name} failed to load</strong>
          <p style={{ margin: "8px 0 0", fontSize: 13, color: "#f0caca" }}>
            {(this.state.error as Error).message}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

function HostCounter() {
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <button
      style={{
        backgroundColor: "rgb(246, 179, 82)",
        border: "0 solid #e2e8f0",
        borderRadius: 4,
        color: "rgb(24, 24, 24)",
        cursor: "pointer",
        fontWeight: 700,
        marginTop: 10,
        padding: "8px 16px",
      }}
      onClick={() => setCount((c) => c + 1)}
    >
      Host counter: {count}
    </button>
  );
}

function HostSsrComponent() {
  const [hydrated, setHydrated] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <div
      style={{
        background: "#3178c6",
        boxShadow: "0 0 20px rgba(0, 0, 0, 0.4)",
        borderRadius: 5,
        color: "white",
        margin: 20,
        padding: 20,
        textAlign: "center",
        width: 250,
      }}
    >
      <div style={{ marginTop: 10, fontSize: 21 }}>Host SSR component</div>
      <p
        style={{
          margin: "10px 0 16px",
          fontSize: 12,
          color: "rgba(255, 255, 255, 0.82)",
        }}
      >
        Rendered by host before client hydration.
      </p>
      {hydrated && (
        <button
          onClick={() => setCount((c) => c + 1)}
          style={{
            backgroundColor: "rgb(246, 179, 82)",
            border: "0 solid #e2e8f0",
            borderRadius: 4,
            color: "rgb(24, 24, 24)",
            cursor: "pointer",
            display: "block",
            fontWeight: 700,
            margin: "0 auto 12px",
            padding: "8px 16px",
          }}
        >
          SSR counter: {count}
        </button>
      )}
      <span
        style={{
          alignItems: "center",
          background: hydrated
            ? "linear-gradient(135deg, rgba(156, 224, 170, 0.2), rgba(246, 179, 82, 0.12))"
            : "rgba(255, 255, 255, 0.14)",
          borderRadius: 999,
          boxShadow: hydrated ? "inset 0 0 0 1px rgba(156, 224, 170, 0.18)" : "none",
          color: hydrated ? "#9ce0aa" : "rgba(255, 255, 255, 0.8)",
          display: "inline-flex",
          fontSize: 12,
          fontWeight: 700,
          gap: 7,
          letterSpacing: 0,
          lineHeight: 1,
          padding: "7px 11px",
        }}
      >
        <span
          style={{
            background: hydrated ? "#9ce0aa" : "rgba(255, 255, 255, 0.8)",
            borderRadius: "50%",
            boxShadow: hydrated ? "0 0 8px rgba(156, 224, 170, 0.75)" : "none",
            display: "inline-block",
            height: 7,
            width: 7,
          }}
        />
        {hydrated ? "Hydrated" : "SSR"}
      </span>
    </div>
  );
}

function IndexPage() {
  return (
    <main style={{ fontFamily: "sans-serif" }}>
      <div style={{ float: "left" }}>
        <div
          style={{
            background: "#3178c6",
            boxShadow: "0 0 20px rgba(0, 0, 0, 0.4)",
            borderRadius: 5,
            color: "white",
            margin: 20,
            padding: 20,
            textAlign: "center",
            width: 250,
          }}
        >
          <div className="icon">
            <svg
              enableBackground="new 0 0 512 512"
              height="100px"
              id="Layer_1"
              version="1.1"
              viewBox="0 0 512 512"
              width="100px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M316.01,199.02L256.134,14.817L196.239,199.02H1.134l158.102,113.324L98.53,496.487l157.604-114.232  l157.585,114.232l-60.687-184.143L511.134,199.02H316.01z M335.084,318.257l42.407,128.63L267.22,366.963l-11.086-8.033  l-11.086,8.033l-110.291,79.923l42.408-128.63l4.353-13.18l-11.289-8.08L59.903,217.909h136.336h13.724l4.242-13.051l41.929-128.957  l41.91,128.957l4.242,13.051h13.724h136.336l-110.327,79.088l-11.27,8.08L335.084,318.257z"
                fill="#f6b352"
              />
            </svg>
          </div>
          <div style={{ margin: "25px 0 8px", fontSize: 21 }}>I'm the host app</div>
          <p style={{ margin: "0 0 10px", fontSize: 12, color: "rgba(255, 255, 255, 0.82)" }}>
            Remotes registered at runtime with <code>registerRemotes</code> /{" "}
            <code>loadRemote</code>
          </p>
          <HostCounter />
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <HostSsrComponent />

        <RemoteErrorBoundary name="Widget">
          <Suspense fallback={<div>Loading remote widget...</div>}>
            <RemoteWidget />
          </Suspense>
        </RemoteErrorBoundary>

        <RemoteErrorBoundary name="Counter">
          <Suspense fallback={<div>Loading remote counter...</div>}>
            <RemoteCounter />
          </Suspense>
        </RemoteErrorBoundary>
      </div>
    </main>
  );
}
