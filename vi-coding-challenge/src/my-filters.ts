import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('my-filters')
export class Filters extends LitElement {

  @property({ type: String })
  filterTitle = 'Filter'

  @property({ type: String })
  filterType = 'Type'

  @property({ type: Array })
  filterItems: string[] = []

  @property({ type: Array })
  selected: any[] = []

  render() {
    return html`
      <section class="filter-container">  
        <div>
          <h3>${this.filterTitle}</h3>
          <p>${this.filterType}</p>

          <div class="checkbox-container">
            ${this.filterItems.map(item => html`<div class="checkbox-item"><input type="checkbox" @change=${(e: Event) => this._handleCheckbox(e, item)} /> ${item.charAt(0).toUpperCase() + item.slice(1)}</div>`)}
         </div>
        </div>
      </section>
    `
  }


  private _handleCheckbox(e: Event, itemName: string) {
    const checkbox = e.target as HTMLInputElement
    if (checkbox.checked) {
      this.selected = [...this.selected, itemName]
    } else {
      this.selected = this.selected.filter(item => item !== itemName)
    }
    console.log(this.selected)
    
    this.dispatchEvent(new CustomEvent('selection-changed', {
      detail: { selected: this.selected },
      bubbles: true,
      composed: true
    }))
  }

  static styles = css`

    .filter-container {
      border: 1px solid #ccc;
      padding: 8px;
    }
    .checkbox-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .checkbox-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'my-filters': Filters;
  }
}
