import { mount } from "svelte";
import Counter from "./components/Counter.svelte";

export function mountCounter(target: HTMLElement) {
  return mount(Counter, { target });
}
