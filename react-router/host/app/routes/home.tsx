import { lazy, Suspense, useState } from "react";
import { loadRemoteModule } from "../mf/load-remote";

const Note = lazy(() => loadRemoteModule("remote/Note"));

export default function Home() {
  const [count, setCount] = useState(0);
  return (
    <main>
      <h1>I'm the host app</h1>
      <button onClick={() => setCount((c) => c + 1)}>Host counter: {count}</button>
      <Suspense fallback={<p>Loading remote…</p>}>
        <Note />
      </Suspense>
    </main>
  );
}
