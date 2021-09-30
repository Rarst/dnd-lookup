const sources = {
  abilities: 'Ability-Scores',
  classes: 'Classes',
  conditions: 'Conditions',
  'damage types': 'Damage-Types',
  equipment: 'Equipment',
  features: 'Features',
  languages: 'Languages',
  'magic schools': 'Magic-Schools',
  monsters: 'Monsters',
  proficiencies: 'Proficiencies',
  properties: 'Weapon-Properties',
  races: 'Races',
  skills: 'Skills',
  spells: 'Spells',
  subclasses: 'Subclasses',
  subraces: 'Subraces',
  traits: 'Traits'
}

const rawData = {}

export default {

  fetchAll (typeLoadedCallback) {
    return Promise.all(
      Object.keys(sources).map(type => this.fetch(type, typeLoadedCallback))
    )
  },

  fetch (type, typeLoadedCallback) {
    return window.fetch(`https://cdn.jsdelivr.net/gh/bagelbits/5e-database@master/src/5e-SRD-${sources[type]}.json`)
      .then(response => response.json())
      .then(data => {
        if (type === 'abilities') {
          data = data.map(item => {
            item.short_name = item.name
            item.name = item.full_name
            return item
          })
        } else if (type === 'features') {
          // data = data.filter(item => !item.name.includes('Spellcasting: '))
        } else if (type === 'proficiencies') {
          data = data.filter(item => item.classes.length || item.races.length)
        }
        rawData[type] = data.map(item => {
          item.search_type = type
          item.key = `${type}-${item.index}`
          return item
        })

        typeLoadedCallback(type)
      })
  },

  query (query) {
    if (!query) {
      return []
    }

    query = query.toLowerCase()

    return Object.keys(sources)
      .map(type => this.filter(type, query))
      .flat()
      .sort((a, b) => a.name.localeCompare(b.name))
  },

  filter (type, query) {
    if (type === query) {
      return rawData[type]
    }

    let filtered = []
    let duplicates = false

    if (type === 'equipment') {
      filtered = filtered.concat(
        rawData[type].filter(item => item.equipment_category.name.toLowerCase() === query)
      )
      duplicates = true
    }

    filtered = filtered.concat(
      rawData[type].filter(item => item.name.toLowerCase().includes(query))
    )

    filtered = duplicates ? Array.from(new Set(filtered)) : filtered

    return filtered
  }
}
