/**
 * Copyright 2020 WaxaM
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
const __SERVICEAPI = "https://localhost:8000/generatePackage?data=";
const __NPMAPI = "http://registry.npmjs.com/-/v1/search?size=5&text=";
/**
 * `package-picker`
 * `pick items from npm registry and github locations`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @demo demo/index.html
 * @customElement package-picker
 */
class PackagePicker extends LitElement {
  /**
   * Convention we use
   */
  static get tag() {
    return "package-picker";
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.searchTerm = "";
    this.responseList = [];
    this.list = [];
    import("@lrnwebcomponents/simple-fields/lib/simple-fields-field.js");
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      <simple-fields-field
        id="urltosend"
        disabled
        aria-controls="urltosend"
        label="URL to request"
        type="url"
        required
        auto-validate=""
      ></simple-fields-field>
      <simple-fields-field
        id="add"
        aria-controls="add"
        label="Add via URL"
        type="url"
        auto-validate=""
        @keypress="${this.keyPressed}"
      ></simple-fields-field>
      <simple-fields-field
        id="searchterm"
        aria-controls="searchterm"
        label="Search NPM"
        type="text"
        auto-validate=""
        @value-changed="${this.searchTermChanged}"
      ></simple-fields-field>
      <div class="response-list">
        ${this.responseList.map(
          item => html`
            <button
              class="response-item"
              @click="${this.clickPackage}"
              data-name="${item.package.name}"
              data-version="${item.package.version}"
            >
              ${item.package.name} (${item.package.version})
              <div>${item.package.description}</div>
              <div>author: ${item.package.publisher.username}</div>
            </button>
          `
        )}
      </div>
      <div class="item-list">
        ${this.list.map(
          (item, index) => html`
            <simple-fields-field
              id="item-${index}"
              @value-changed="${this.checkChanged}"
              label="${item.name} (${item.version})"
              .value="${item.value}"
              type="checkbox"
            ></simple-fields-field>
          `
        )}
      </div>
    `;
  }
  keyPressed(e) {
    if (e.key === "Enter") {
      let list = this.list;
      list.push({
        name: this.shadowRoot.querySelector("#add").value,
        version: "*",
        value: true
      });
      this.list = [...list];
      this.shadowRoot.querySelector("#add").field.value = "";
      this.shadowRoot.querySelector("#add").value = "";
    }
  }
  checkChanged(e) {
    // remove if unchecked
    if (!e.detail.value) {
      let list = this.list;
      let index = parseInt(e.target.id.replace("item-", ""));
      if (list[index].target) {
        list[index].target.removeAttribute("disabled");
      }
      list.splice(index, 1);
      this.list = [...list];
    }
  }
  clickPackage(e) {
    var index = 0;
    while (e.path[index].tagName != "BUTTON") {
      index++;
    }
    let target = e.path[index];
    target.setAttribute("disabled", "disabled");
    let list = this.list;
    list.push({
      name: target.getAttribute("data-name"),
      version: target.getAttribute("data-version"),
      value: true,
      target: target
    });
    this.list = [...list];
  }
  searchTermChanged(e) {
    // only process if longer then 3 in the search term
    if (e.detail.value && e.detail.value.length > 3) {
      this.searchTerm = e.detail.value;
    }
  }
  /**
   * LitElement render styles
   */
  static get styles() {
    return css`
      :host {
        display: block;
      }

      :host([hidden]) {
        display: none;
      }
      .response-item {
        width: 400px;
        background-color: #eeeeee;
        font-size: 16px;
        height: 100px;
        border: 1px solid black;
        color: #000000;
        overflow: hidden;
      }
      .response-item:active,
      .response-item:focus,
      .response-item:hover {
        background-color: #dddddd;
      }
    `;
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      responseList: {
        type: Array
      },
      list: {
        type: Array
      },
      searchTerm: {
        type: String
      }
    };
  }
  updateURLToSend(list) {
    var response = {};
    // transform from array to object key pair
    list.forEach(el => {
      response[el.name] = el.version;
    });
    this.shadowRoot.querySelector("#urltosend").value =
      __SERVICEAPI + JSON.stringify(response);
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "searchTerm") {
        fetch(`${__NPMAPI}${this[propName]}`)
          .then(response => {
            return response.json();
          })
          .then(data => {
            this.responseList = [...data.objects];
          })
          .catch(err => {
            console.warn(err);
          });
      }
      if (propName == "list") {
        this.updateURLToSend(this[propName]);
      }
    });
  }
}
customElements.define(PackagePicker.tag, PackagePicker);
export { PackagePicker };
