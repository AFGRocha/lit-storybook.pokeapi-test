import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './my-filters'
import './item-card'

@customElement('app-container')
export class AppContainer extends LitElement {
    @property({ type: Array })
    selectedItems: any[] = []

    @property({ type: Array })
    items: any[] = []

    private offset = 0
    private limit = 20
    private isLoading = false

    render() {
        return html`
        <h1>These are our products</h1>
      <div class="container">
        <div class="filters-section">
          <my-filters showImages @selection-changed=${this._handleSelectionChange}></my-filters>
        </div>
        
        <div class="items-section" @scroll=${this._handleScroll}>
          <div class="item-grid">
            ${this.items.map(item => html`
              <item-card 
                .title=${item.name}
                .description=${item.types}
                .image=${item.image}
                showImages
              ></item-card>
            `)}
          </div>
        </div>
      </div>
    `;
    }

    firstUpdated() {
        this._fetchItems()
    }

    private _handleSelectionChange(e: CustomEvent) {
        this.selectedItems = e.detail.selected
        console.log('Parent received selected items:', this.selectedItems)
    }

    private _handleScroll(e: Event) {
        const element = e.target as HTMLElement
        const threshold = 300
        const nearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < threshold

        if (nearBottom && !this.isLoading) {
            this._loadMoreItems()
        }
    }

    private async _fetchItems() {
        try {
            this.isLoading = true
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${this.limit}&offset=${this.offset}`)
            const data = await response.json()

            // Only fetch types once on initial load
            if (this.offset === 0) {
                const typesResponse = await fetch('https://pokeapi.co/api/v2/type/')
                const typesData = await typesResponse.json()

                const typeMap = new Map<string, any[]>()
                for (const type of typesData.results) {
                    const typeResponse = await fetch(type.url)
                    const typeDetail = await typeResponse.json()
                    for (const pokemon of typeDetail.pokemon) {
                        const name = pokemon.pokemon.name
                        if (!typeMap.has(name)) {
                            typeMap.set(name, [])
                        }
                        typeMap.get(name)!.push({ name: type.name, index: typeDetail.id })
                    }
                }

                this.items = data.results.map((p: any) => {
                    const id = p.url.split('/').filter(Boolean).pop()
                    return {
                        name: p.name,
                        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
                        types: typeMap.get(p.name) || []
                    }
                })
            }

            this.offset += this.limit
        } catch (error) {
            console.error('Error fetching pokemon:', error)
        } finally {
            this.isLoading = false
        }
    }

    private async _loadMoreItems() {
        try {
            this.isLoading = true
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${this.limit}&offset=${this.offset}`)
            const data = await response.json()

            const typesResponse = await fetch('https://pokeapi.co/api/v2/type/')
            const typesData = await typesResponse.json()

            const typeMap = new Map<string, any[]>()
            for (const type of typesData.results) {
                const typeResponse = await fetch(type.url)
                const typeDetail = await typeResponse.json()
                for (const pokemon of typeDetail.pokemon) {
                    const name = pokemon.pokemon.name
                    if (!typeMap.has(name)) {
                        typeMap.set(name, [])
                    }
                    typeMap.get(name)!.push({ name: type.name, index: typeDetail.id })
                }
            }

            const newItems = data.results.map((p: any) => {
                const id = p.url.split('/').filter(Boolean).pop()
                return {
                    name: p.name,
                    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
                    types: typeMap.get(p.name) || []
                }
            })

            this.items = [...this.items, ...newItems]
            this.offset += this.limit
        } catch (error) {
            console.error('Error loading more pokemon:', error)
        } finally {
            this.isLoading = false
        }
    }

    static styles = css`
    :host {
      display: block;
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
  `;
}



declare global {
    interface HTMLElementTagNameMap {
        'app-container': AppContainer;
    }
}

