import CounterSsr from "../../counter-ssr";

// Server-rendered HTML fragment consumed by the host. The markers let the
// host extract exactly the counter markup from the full document.
export default function CounterFragment() {
  return (
    <>
      <template data-mf-fragment-start="counter" />
      <CounterSsr />
      <template data-mf-fragment-end="counter" />
    </>
  );
}
