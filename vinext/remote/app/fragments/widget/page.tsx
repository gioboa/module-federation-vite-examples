import Widget from "../../widget";

// Server-rendered HTML fragment consumed by the host. The markers let the
// host extract exactly the widget markup from the full document.
export default function WidgetFragment() {
  return (
    <>
      <template data-mf-fragment-start="widget" />
      <Widget />
      <template data-mf-fragment-end="widget" />
    </>
  );
}
