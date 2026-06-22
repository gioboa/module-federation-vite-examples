import { mount } from "svelte";
import Widget from "./components/Widget.svelte";

export function mountWidget(target: HTMLElement) {
  return mount(Widget, { target });
}
