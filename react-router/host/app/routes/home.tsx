import { lazy, Suspense, useState } from "react";
import { loadRemoteModule } from "../mf/load-remote";

const Note = lazy(() => loadRemoteModule("remote/Note"));

export default function Home() {
  const [count, setCount] = useState(0);
  return (
    <main>
      <div
        style={{
          background: "#3178c6",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.4)",
          borderRadius: 5,
          margin: 20,
          width: 250,
          padding: 20,
          textAlign: "center",
          color: "white",
          float: "left",
        }}
      >
        <svg
          width="100"
          height="100"
          fill="#f6b352"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M316.01,199.02L256.134,14.817L196.239,199.02H1.134l158.102,113.324L98.53,496.487l157.604-114.232  l157.585,114.232l-60.687-184.143L511.134,199.02H316.01z M335.084,318.257l42.407,128.63L267.22,366.963l-11.086-8.033  l-11.086,8.033l-110.291,79.923l42.408-128.63l4.353-13.18l-11.289-8.08L59.903,217.909h136.336h13.724l4.242-13.051l41.929-128.957  l41.91,128.957l4.242,13.051h13.724h136.336l-110.327,79.088l-11.27,8.08L335.084,318.257z" />
        </svg>
        <div style={{ marginTop: 10, fontSize: 25 }}>I'm the host app</div>
        <button
          style={{
            border: "0 solid #e2e8f0",
            marginTop: 10,
            backgroundColor: "rgb(246, 179, 82)",
            borderRadius: ".25rem",
            fontWeight: 700,
            padding: ".5rem 1rem",
            color: "rgb(24, 24, 24)",
          }}
          onClick={() => setCount((c) => c + 1)}
        >
          Host counter: {count}
        </button>
      </div>
      <Suspense fallback="loading...">
        <Note />
      </Suspense>
    </main>
  );
}
