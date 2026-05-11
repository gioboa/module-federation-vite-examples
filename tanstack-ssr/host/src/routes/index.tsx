import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, Component } from "react";
import type { ReactNode } from "react";

const RemoteWidget = lazy(() => import("remote/Widget"));
const RemoteCounter = lazy(() => import("remote/Counter"));

// Pre-load remote modules before render so the MF runtime resolves them
// server-side via ssrEntryLoader. Without this, React.lazy returns the
// dev proxy synchronously — the module is null during SSR and renders nothing.
export const Route = createFileRoute("/")({
  loader: () =>
    Promise.all([import("remote/Widget"), import("remote/Counter")]).then(() => null),
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
            border: "2px solid #cc0000",
            borderRadius: 8,
            padding: 24,
            maxWidth: 320,
            background: "#fff5f5",
          }}
        >
          <strong style={{ color: "#cc0000" }}>{this.props.name} failed to load</strong>
          <p style={{ margin: "8px 0 0", fontSize: 13, color: "#555" }}>
            {(this.state.error as Error).message}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

function IndexPage() {
  return (
    <main style={{ fontFamily: "sans-serif", padding: 32 }}>
      <h1>I'm the host app</h1>
      <p style={{ color: "#555", marginBottom: 24 }}>
        Remote components below are loaded via Module Federation and server-rendered. The hydration
        badge flips from <code>ssr</code> to <code>hydrated</code> after client-side JS loads. Both
        components consume <code>ThemeContext</code> provided by this host — validating the React
        singleton is shared across the MF boundary.
      </p>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
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
