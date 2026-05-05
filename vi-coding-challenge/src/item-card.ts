import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('item-card')
export class ItemCard extends LitElement {
  @property({ type: String }) title = '';
  @property({ type: Array }) description: string[] = [];
  @property({ type: String }) image = '';
  @property({ type: Boolean }) showImages = false;

  static styles = css`
    :host {
      display: block;
    }

    .card {
      border: 1px solid #ccc;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      background: white;
    }

    .card-image {
      width: 100%;
      height: 300px;
      object-fit: cover;
    }

    .card-content {
      padding: 16px;
    }

    .card-title {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 600;
    }

    .card-description {
      margin: 0;
      font-size: 14px;
      color: #666;
    }

    .type-images {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .type-image {
      width: 72px;
      height: 72px;
      object-fit: contain;
    }
  `;

  render() {
    return html`
      <div class="card">
        ${this.image ? html`<img src="${this.image}" alt="${this.title}" class="card-image" />` : ''}
        <div class="card-content">
          ${this.title ? html`<h2 class="card-title">${this.title.charAt(0).toUpperCase() + this.title.slice(1)}</h2>` : ''}
          ${this.description.length ? (this.showImages ? html`<div class="type-images">${this.description.map((type: any) => html`<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/${type.index}.png" alt="${type.name}" class="type-image" title="${type.name}" />`)}</div>` : html`<p class="card-description">${this.description.map((type: any) => type.name).join(', ')}</p>`) : ''}
        </div>
      </div>
    `;
  }
}


declare global {
  interface HTMLElementTagNameMap {
    'item-card': ItemCard;
  }
}
