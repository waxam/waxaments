/**
 * Copyright 2020 WaxaM LLC
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";

/**
 * `service-card`
 * `present services in a simple to read card`
 *
 * @demo demo/index.html
 * @customElement service-card
 */
class ServiceCard extends LitElement {
  /**
   * Convention we use
   */
  static get tag() {
    return "service-card";
  }

  static get styles() {
    return [
      css`
        :host {
          display: inline-block;
          --service-card-bg: #ffffff;
          --service-card-color: #222222;
          opacity: 0.9;
          outline: none;
        }
        .wrapper {
          background-color: var(--service-card-bg);
          color: var(--service-card-color);
        }
        :host([active]) {
          opacity: 1;
          -moz-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.4);
          box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.4);
          outline: #eeeeee;
        }
      `
    ];
  }
  render() {
    return html`
      <div class="wrapper">
        <div class="price-block">
          <div class="top-part">
            <h3 class="plan-title">${this.planName}</h3>
            <p class="plan-price">
              <sup>${this.planMoneySign}</sup>${this.planCost}
            </p>
            <p class="plan-duration">${this.planLength}</p>
          </div>
          <div class="bottom-part">
            <slot name="features"></slot>
            <a class="button" href="${this.link}">${this.label}</a>
          </div>
        </div>
      </div>
    `;
  }
  static get properties() {
    return {
      planName: { type: String, attribute: "plan-name" },
      planMoneySign: { type: String, attribute: "plan-money-sign" },
      planCost: { type: String, attribute: "plan-cost" },
      planLength: { type: String, attribute: "plan-length" },
      link: { type: String },
      label: { type: String },
      active: { type: Boolean, reflect: true }
    };
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.planName = "Standard";
    this.planMoneySign = "$";
    this.planCost = "0.00";
    this.planLength = "Per Year";
    this.link = "";
    this.label = "Get started";
    setTimeout(() => {
      this.addEventListener("click", this.activate);
      this.addEventListener("mouseenter", this.activate);
      this.addEventListener("mouseleave", this.deactivate);
      this.addEventListener("focusin", this.activate);
      this.addEventListener("focusout", this.deactivate);
    }, 0);
  }
  activate(e) {
    this.active = true;
  }
  deactivate(e) {
    this.active = false;
  }
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    // make able to accept focus
    this.setAttribute("tabindex", "0");
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      /* notify example
      // notify
      if (propName == 'format') {
        this.dispatchEvent(
          new CustomEvent(`${propName}-changed`, {
            detail: {
              value: this[propName],
            }
          })
        );
      }
      */
      /* observer example
      if (propName == 'activeNode') {
        this._activeNodeChanged(this[propName], oldValue);
      }
      */
      /* computed example
      if (['id', 'selected'].includes(propName)) {
        this.__selectedChanged(this.selected, this.id);
      }
      */
    });
  }
}
customElements.define(ServiceCard.tag, ServiceCard);
export { ServiceCard };
