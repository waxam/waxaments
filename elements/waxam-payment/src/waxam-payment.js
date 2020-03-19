/**
 * `waxam-payment`
 * `Payment broker for waxam properties`
 * @demo demo/index.html
 * @customElement `waxam-payment`
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { ifDefined } from "lit-html/directives/if-defined.js";
import "@power-elements/json-viewer/json-viewer.js";
import "@power-elements/stripe-elements/stripe-payment-request.js";
import { PUBLISHABLE_KEY } from "./lib/config.js";

class WaxamPayment extends LitElement {
  /**
   * Convention we use
   */
  static get tag() {
    return "waxam-payment";
  }
  static get properties() {
    return {
      shippingOptions: { type: Array },
      displayItems: { type: Array },
      amount: { type: Number },
      label: { type: String },
      country: { type: String },
      currency: { type: String },
      debug: { type: Boolean },
      paymentMethod: { type: Object },
      error: { type: Object }
    };
  }
  constructor() {
    super();
    this.debug = false;
    this.amount = 0;
    this.label = "Purchase";
    this.country = "US";
    this.currency = "usd";
    this.displayItems = [
      { amount: 125, label: "Double Double" },
      { amount: 199, label: "Box of 10 Timbits" }
    ];
    this.shippingOptions = [
      {
        id: "pick-up",
        amount: 0,
        label: "Pick Up",
        detail: "Pick Up at Your Local Timmy's"
      },
      {
        id: "delivery",
        amount: 200,
        label: "Delivery",
        detail: "Timbits to Your Door"
      }
    ];
  }
  render() {
    return html`
      <stripe-payment-request
        publishable-key="${PUBLISHABLE_KEY}"
        .shippingOptions="${this.shippingOptions}"
        .displayItems="${this.displayItems}"
        amount="${this.amount}"
        label="${this.label}"
        country="${this.country}"
        currency="${this.currency}"
        @payment-method="${this.onPaymentMethod}"
        @error="${this.onError}"
        generate="payment-method"
        request-payer-name
        request-payer-email
        request-payer-phone
      >
      </stripe-payment-request>
      <json-viewer
        object="${ifDefined(this.error || this.paymentMethod)}"
      ></json-viewer>
    `;
  }

  onPaymentMethod({ detail: paymentMethod }) {
    this.paymentMethod = paymentMethod;
  }

  onError({ target: { error } }) {
    if (this.debug) {
      this.error = error;
      console.error(error);
    }
  }
}
customElements.define(WaxamPayment.tag, WaxamPayment);
export { WaxamPayment };
