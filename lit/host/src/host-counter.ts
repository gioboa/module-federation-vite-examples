import { LitElement, css, html } from "lit";
import { property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

export class HostCounter extends LitElement {
  @property({ type: String })
  label = "Counter";

  @state()
  private count = 0;

  render() {
    const classes = { counter: true };

    return html`
      <button class=${classMap(classes)} type="button" @click=${this.increment}>
        ${this.label}: ${this.count}
      </button>
    `;
  }

  private increment = () => {
    this.count += 1;
  };

  static styles = css`
    .counter {
      border: 0 solid #e2e8f0;
      margin-top: 10px;
      background-color: rgb(246, 179, 82);
      border-radius: 0.25rem;
      font-weight: 700;
      padding: 0.5rem 1rem;
      color: rgb(24, 24, 24);
      cursor: pointer;
    }
  `;
}

if (!customElements.get("host-counter")) {
  customElements.define("host-counter", HostCounter);
}
