let isLoading = false;

async function fetchPokemon(limit: number, offset: number, typesMap: Map<string, any[]> = new Map()) {
    let items;
    try {
        isLoading = true
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
        const data = await response.json()


        items = data.results.map((p: any) => {
            const id = p.url.split('/').filter(Boolean).pop()
            return {
                name: p.name,
                image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
                types: typesMap.get(p.name) || [],
                entry: id
            }
        })

        //this.savedData = [...this.items]
        offset += limit
    } catch (error) {
        console.error('Error fetching pokemon:', error)
    } finally {
        isLoading = false
        return items
    }
}

async function fetchTypes() {
    const typesResponse = await fetch('https://pokeapi.co/api/v2/type/')
    const typesData = await typesResponse.json()

    const typeMap = new Map<string, any[]>()
    const typeData = new Map<string, any>()
    for (const type of typesData.results) {
        const typeResponse = await fetch(type.url)
        const typeDetail = await typeResponse.json()
        typeData.set(type.name, typeDetail)

        for (const pokemon of typeDetail.pokemon) {
            const name = pokemon.pokemon.name
            if (!typeMap.has(name)) {
                typeMap.set(name, [])
            }
            typeMap.get(name)!.push({ name: type.name, index: typeDetail.id })
        }
    }
    return { typeMap, typeData }
}


export default {
    fetchPokemon,
    fetchTypes
}