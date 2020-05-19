import { LitElement, html, css } from "lit-element/lit-element.js";
import "@power-elements/stripe-elements/stripe-payment-request.js";
/**
 * `stripe-payment`
 * `Payment broker for stripe`
 *
 * @customElement `stripe-payment`
 * @demo demo/index.html
 */
class StripePayment extends LitElement {
  /**
   * Convention
   */
  static get tag() {
    return "stripe-payment";
  }
  /**
   * LitElement render styles
   */
  static get styles() {
    return [
      css`
        [hidden] {
          display: none !important;
        }
        :host {
          font-family: "Nunito Sans", -apple-system, ".SFNSText-Regular",
            "San Francisco", BlinkMacSystemFont, "Segoe UI", "Helvetica Neue",
            Helvetica, Arial, sans-serif;
          align-items: center;
          display: grid;
          grid-gap: 12px;
          grid-template-areas:
            "support support"
            "stripe submit"
            "output output";
        }
        stripe-payment-request {
          grid-area: submit/stripe/stripe/submit;
        }
        stripe-elements {
          grid-area: stripe;
        }
        mwc-button {
          grid-area: submit;
        }
        json-viewer {
          grid-area: output;
        }

        stripe-elements:not(:defined),
        json-viewer:not(:defined),
        mwc-button:not(:defined) {
          display: none;
        }
      `
    ];
  }
  /**
   * LitElement / popular convention
   */
  static get properties() {
    return {
      publishableKey: { type: String, attribute: "publishable-key" },
      shippingOptions: { type: Array },
      displayItems: { type: Array },
      amount: { type: Number },
      label: { type: String },
      country: { type: String },
      currency: { type: String },
      paymentMethod: { type: Object },
      error: { type: Object },
      output: { type: Object },
      unsupported: { type: Boolean },
      submitDisabled: { type: Boolean },
      paymentText: { type: String, attribute: "payment-text" },
      debug: { type: Boolean },
      action: { type: String },
      generate: { type: String }
    };
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.submitDisabled = true;
    this.debug = false;
    this.displayItems = [];
    this.shippingOptions = [];
    this.amount = 0;
    // endpoint to submit on success
    this.action = '';
    this.generate = 'source';
    this.paymentText = "Submit";
    this.label = "Purchase";
    this.country = "US";
    this.currency = "usd";
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      <stripe-payment-request
        ?hidden="${this.output || this.unsupported}"
        action="${this.action}"
        generate="${this.generate}"
        publishable-key="${this.publishableKey}"
        .shippingOptions="${this.shippingOptions}"
        .displayItems="${this.displayItems}"
        amount="${this.amount}"
        label="${this.label}"
        country="${this.country}"
        currency="${this.currency}"
        @payment-method="${this.onPaymentMethod}"
        @error="${this.onError}"
        @success="${this.onSuccess}"
        @fail="${this.onFail}"
        @ready="${this.onReady}"
        @unsupported="${this.onUnsupported}"
        request-payer-name
        request-payer-email
        request-payer-phone
      >
        ${this.displayItems.map(
          item => html`
            <stripe-display-item
              data-amount="${item.amount}"
              data-label="${item.label}"
            ></stripe-display-item>
          `
        )}
        ${this.shippingOptions.map(
          ship => html`
            <stripe-shipping-option
              data-id="${ship.id}"
              data-label="${ship.label}"
              data-detail="${ship.detail}"
              data-amount="${ship.amount}"
            ></stripe-shipping-option>
          `
        )}
      </stripe-payment-request>
      ${this.debug
        ? html`
            <json-viewer
              .object="${this.error ? this.error : this.paymentMethod}"
            ></json-viewer>
          `
        : ``}
      ${this.unsupported
        ? html`
            <stripe-elements
              ?hidden="${this.output}"
              action="${this.action}"
              generate="${this.generate}"
              publishable-key="${this.publishableKey}"
              @change="${this.onChange}"
              @source="${this.onSuccess}"
              @error="${this.onError}"
            >
            </stripe-elements>
            <mwc-button
              tabindex="0"
              ?hidden="${this.output}"
              ?disabled="${this.submitDisabled}"
              @click="${this.onClick}"
              >${this.paymentText}</mwc-button
            >
          `
        : ``}
    `;
  }
  /**
   * LitElement property change record
   */
  updated(changedProperties) {
    changedProperties.forEach((oldvalue, propName) => {
      if (propName == "debug" && this[propName]) {
        // import json viewer if we are debugging
        import("@power-elements/json-viewer/json-viewer.js");
      }
    });
  }

  onPaymentMethod({ detail: paymentMethod }) {
    this.paymentMethod = paymentMethod;
  }
  onChange({ target: { complete, hasError } }) {
    this.submitDisabled = !(complete && !hasError);
  }
  onError({ target: { error } }) {
    this.error = error;
    if (this.debug && this.error) {
      console.error(error);
    }
  }
  onClick() {
    this.shadowRoot.querySelector("stripe-elements").submit();
  }
  onFail(event) {
    this.output = event.detail;
  }
  onReady() {
    this.unsupported = false;
  }
  onSuccess(event) {
    this.output = event.detail;
  }
  onUnsupported() {
    this.unsupported = true;
    // import form when we fail our first check
    import("@power-elements/stripe-elements/stripe-elements.js");
    import("@material/mwc-button/mwc-button.js");
  }
}
customElements.define(StripePayment.tag, StripePayment);
export { StripePayment };
