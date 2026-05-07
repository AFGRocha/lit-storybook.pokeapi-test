import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';
import { Router } from '@lit-labs/router';
import './my-filters'
import './item-card'
import './item-details'

@customElement('app-container')
export class AppContainer extends LitElement {
  @property({ type: Array })
  selectedItems: any[] = []

  @property({ type: Array })
  items: any[] = []

  private router = new Router(this, [
    { path: '/', render: () => this.renderHome() },
    { path: '/details/:id', render: (params: any) => this.renderDetails(params.id) },
  ])

  @property()
  fetchItemsFunction: (limit: number, offset: number, typesMap: Map<string, any[]>) => Promise<any[]> = async () => []

  @property()
  fetchFilterTypesFunction: () => Promise<{ typeMap: Map<string, any[]>, typeData: Map<string, any> }> = async () => ({ typeMap: new Map(), typeData: new Map() })

  @property({ type: Boolean })
  shouldInitialize: boolean = false

  @property({ type: Array })
  availableTypes: any[] = []

  private offset = 0
  private limit = 20
  private typesMap: Map<string, any[]> = new Map()
  private typeData: Map<string, any> = new Map()
  private savedData: any[] = []

  render() {
    return html`${this.router.outlet()}`;
  }

  private renderHome() {
    return html`
      <div class="header">
        <h1>These are our products</h1>
      </div>
      
      <div class="container">
        <div class="filters-section">
          <my-filters .filterItems=${this.availableTypes} showImages @selection-changed=${this._handleSelectionChange}></my-filters>
        </div>
        
        <div class="items-section" @scroll=${this._handleScroll}>
          <div class="item-grid">
            ${this.items.map(item => html`
              <item-card 
                .title=${item.name}
                .description=${item.types}
                .image=${item.image}
                .entry=${item.entry}
                showImages
                @click=${() => this._navigateToDetails(item.entry)}
              ></item-card>
            `)}
          </div>
        </div>
      </div>
    `;
  }

  private renderDetails(itemId: string) {
    return html`<item-details .itemId=${itemId}></item-details>`;
  }

  private _navigateToDetails(itemId: string) {
    window.history.pushState({ page: 'details', itemId }, '', `/details/${itemId}`);
    this.router.goto(`/details/${itemId}`);
  }

  private initialized = false

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('popstate', () => {
      this.router.goto(window.location.pathname);
    });
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has('shouldInitialize') && this.shouldInitialize && !this.initialized) {
      this.initialized = true
      this._initialize()
    }
  }

  private async _initialize() {
    await this._fetchTypes()
    await this._fetchItems()
  }

  private _handleSelectionChange(e: CustomEvent) {
    this.selectedItems = e.detail.selected
    this.items = []
    if (this.selectedItems.length === 0) {
      this.items = [...this.savedData]
    } else {
      for (const selectedType of this.selectedItems) {
        const typeDetail = this.typeData.get(selectedType)
        if (typeDetail) {
          const filteredPokemon = typeDetail.pokemon.map((p: any) => {
            const id = p.pokemon.url.split('/').filter(Boolean).pop()
            return {
              name: p.pokemon.name,
              image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
              types: this.typesMap.get(p.pokemon.name) || [],
              entry: id
            }
          })
          this.items = [...this.items, ...filteredPokemon]
        }
      }
    }
  }

  private _handleScroll(e: Event) {
    const element = e.target as HTMLElement
    const threshold = 300
    const nearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < threshold
    if (nearBottom) {
      this._fetchItems()
    }
  }

  private async _fetchItems() {
    this.items = [...this.items, ...await this.fetchItemsFunction(this.limit, this.offset, this.typesMap)]
    this.offset += this.limit
    this.savedData = this.items
  }

  private async _fetchTypes() {
    const { typeMap, typeData } = await this.fetchFilterTypesFunction();
    this.typesMap = typeMap;
    this.typeData = typeData;
    console.log('Fetched types:', typeMap);
    this.availableTypes = Array.from(typeData.entries()).map(([name, data]: [string, any]) => ({
      name,
      image: data.image
    }));
  }

  static styles = css`
    :host {
      display: block;
      font-family: 'Open Sans', sans-serif;
    }

    .header {
      background-color: #8a4ebb;
      text-align: center;
    }

    .header h1 {
      margin: 0;
      padding: 20px 0;
      color: #fff;
    }
    
    .container {
      display: flex;
      gap: 20px;
      padding: 20px;
      height: 100vh;
      overflow: hidden;
    }
    
    .filters-section {
      width: 250px;
      flex-shrink: 0;
    }
    
    .items-section {
      flex: 1;
      overflow-y: auto;
      padding-bottom: 150px;
    }
    
    .item-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 16px;
    }

    item-card {
      cursor: pointer;
    }
  `;
}



declare global {
  interface HTMLElementTagNameMap {
    'app-container': AppContainer;
  }
}

