import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-filters')
export class Filters extends LitElement {
  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number })
  count = 0

  @property({ type: String })
  filterTitle = 'Filter'

  @property({ type: String })
  filterType = 'Type'

  @property({ type: String })
  apiRoute = 'https://pokeapi.co/api/v2/type/'

  @property({ type: Array })
  items: any[] = []

  @property({ type: Array })
  selected: any[] = []

  render() {
    return html`
      <section class="filter-container">
        <div>
          <slot></slot> 
        </div>
        <div>
          <h3>${this.filterTitle}</h3>
          <p>${this.filterType}</p>

          <div class="checkbox-container">
            ${this.items.map(item => html`<div class="checkbox-item"><input type="checkbox" @change=${(e: Event) => this._handleCheckbox(e, item.name)} /> ${item.name.charAt(0).toUpperCase() + item.name.slice(1)}</div>`)}
         </div>
        </div>
      </section>
    `
  }


  firstUpdated() {
    this._callApi()
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

  private async _callApi() {
    try {
      const response = await fetch(this.apiRoute)
      const data = await response.json()
      this.items = data.results
      console.log(this.items)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
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
