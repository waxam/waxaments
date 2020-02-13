/**
 * `waxam-payment`
 * `Payment broker for waxam properties`
 * @demo demo/index.html
 * @customElement `waxam-payment`
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import {ifDefined} from 'lit-html/directives/if-defined.js';
import '@power-elements/stripe-elements/stripe-elements.js';
import { PUBLISHABLE_KEY } from './demo/config.js';

class WaxamPayment extends LitElement {
  /**
   * Convention we use
   */
  static get tag() {
    return "waxam-payment";
  }
  static get properties() {
    return {
      debug: { type: Boolean },
      source: { type: Object },
    }
  }
  constructor() {
    super();
    this.debug = false;
  }
  render() {
    return html`
      <stripe-elements
        publishable-key="${PUBLISHABLE_KEY}"
        @change="${this.onChange}"
        @source="${this.onSource}"
        @error="${this.onError}"
      ></stripe-elements>
    `;
  }

  onChange({ target: { complete, hasError } }) {
    this.shadowRoot.querySelector("stripe-elements").createSource();
  }

  onSource({ detail: source }) {
    this.source = source;
    if (this.debug) {
      console.log(source);
    }
  }

  onError({ target: { error } }) {
    if (this.debug) {
      console.error(error);
    }
  }
}
customElements.define(WaxamPayment.tag, WaxamPayment);
export { WaxamPayment };
