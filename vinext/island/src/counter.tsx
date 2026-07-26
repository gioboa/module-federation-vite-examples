import { useState } from "react";

export type IslandCounterProps = {
  initialCount: number;
  renderedAt: string;
};

/** Runs on the host server through the generated island shell. */
export async function load(): Promise<IslandCounterProps> {
  return {
    initialCount: 18,
    renderedAt: new Date().toISOString(),
  };
}

export default function IslandCounter({ initialCount, renderedAt }: IslandCounterProps) {
  const [count, setCount] = useState(initialCount);

  return (
    <div
      data-mf-react-version="18"
      style={{
        background: "#35255a",
        borderRadius: "10px",
        boxShadow: "0 0 20px rgba(0, 0, 0, 0.4)",
        color: "white",
        padding: "20px",
        textAlign: "center",
        width: "225px",
      }}
    >
      <div style={{ fontSize: "21px", marginTop: "10px" }}>React 18 SSR island</div>
      <p style={{ color: "#d9cef4", fontSize: "12px" }}>
        Server rendered by the remote, hydrated outside the React 19 host tree.
      </p>
      <button
        onClick={() => setCount((current) => current + 1)}
        style={{
          background: "#f6b352",
          border: 0,
          borderRadius: "4px",
          color: "#181818",
          cursor: "pointer",
          fontWeight: 700,
          padding: "8px 16px",
        }}
      >
        Island counter: {count}
      </button>
      <small style={{ display: "block", marginTop: "10px", opacity: 0.7 }}>SSR: {renderedAt}</small>
    </div>
  );
}
