import { renderComponent } from "@ember/renderer";
import RemoteApp from "./components/remote-app.gts";

export default async function mount(element: HTMLElement) {
  const { destroy } = renderComponent(RemoteApp, { into: element });

  return destroy;
}
