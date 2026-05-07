import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('item-details')
export class ItemDetails extends LitElement {
  @property({ type: String })
  itemId: string = '';

  render() {
    return html`
      <div>
        <h1>Item Id: ${this.itemId}</h1>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'item-details': ItemDetails;
  }
}
