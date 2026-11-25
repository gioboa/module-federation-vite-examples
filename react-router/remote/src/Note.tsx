import { useState } from "react";
// A plain CSS import: the remote knows nothing about the host's base URL or
// where it is deployed. The host renders the stylesheet <link> during SSR.
import "./styles.css";

export default function Note() {
  const [count, setCount] = useState(0);
  return (
    <aside className="remote-note">
      <div className="remote-note-title">I'm the remote app</div>
      <button onClick={() => setCount((c) => c + 1)}>Remote counter: {count}</button>
    </aside>
  );
}
