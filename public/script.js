/* global Vue */

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
  })
}

// region DATA

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
  spellcasting: 'Spellcasting',
  spells: 'Spells',
  subclasses: 'Subclasses',
  subraces: 'Subraces',
  traits: 'Traits'
}

const rawData = {}
const showSize = 20

const data = {
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
          data = data.filter(item => !item.name.includes('Spellcasting: '))
        } else if (type === 'proficiencies') {
          data = data.filter(item => item.classes.length || item.races.length)
        } else if (type === 'spellcasting') {
          data = data.map(item => {
            item.name = `Spellcasting (${item.class.name})`
            return item
          })
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
        rawData[type].filter(item => item.equipment_category.toLowerCase() === query)
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
// endregion

// region APP

Vue.component('App',
  {
    data () {
      return {
        loading: true,
        search: '',
        types: [],
        results: [],
        more: []
      }
    },
    template: `
<div>
  <search-input v-model="search" ref="input" :loading="loading" @clear="reset(true)"></search-input>

  <div v-show="!results.length" class="flex flex-wrap justify-center mt-3 px-6 text-lg">
      <type-link v-for="type in types" :type="type" :key="type"></type-link>
  </div>

  <search-item :is="componentType(item.search_type)" v-for="item in results" :item="item" :key="item.key"></search-item>
</div>`,
    created () {
      this.init()

      window.addEventListener('popstate', this.navigate)
      window.addEventListener('keyup', e => e.key === 'Escape' && this.reset(true))
      window.addEventListener('scroll', this.handleScroll, { passive: true })
    },
    watch: {
      search: function (query) {
        this.runSearch(query)
      }
    },
    methods: {
      init () {
        data.fetchAll(type => this.types.push(type)).then(() => {
          if (window.location.hash) {
            this.search = window.location.hash.substring(1).replace(/%20/g, ' ')
          }

          this.types.sort()
          this.loading = false
        })
      },
      handleScroll () {
        if (this.more.length &&
          document.documentElement.scrollHeight - (window.scrollY + window.innerHeight) < 100) {
          this.loadMore()
        }
      },
      runSearch (query) {
        query = query.replace(/%20/g, ' ')
        window.scroll(0, 0)

        if (!query || query.length < 3) {
          this.reset(!query)
          return
        }

        window.location.hash = query
        const results = data.query(query)
        this.results = results.splice(0, showSize)
        this.more = results
      },
      navigate () {
        this.search = window.location.hash.substring(1).replace(/%20/g, ' ')
      },
      loadMore () {
        this.results.push(...this.more.splice(0, showSize))
      },
      reset (resetInput = false) {
        this.results = []
        this.more = []

        if (resetInput) {
          window.location.hash = ''
          this.search = ''
          this.$refs.input.focus()
        }
      },
      componentType (type) {
        return type in Vue.options.components ? type : 'search-item'
      }
    }
  }
)

Vue.component('search-input', {
  created () {
    window.addEventListener('scroll', this.handleScroll, { passive: true })
  },
  data () {
    return {
      lastScrollPosition: 0,
      scrollingDown: false
    }
  },
  props: ['value', 'loading'],
  template: `
  <div :class="headerClasses" class="flex items-center relative sticky top-0 pt-3 transition-opacity duration-300 rounded-full">
    <label class="sr-only" for="search">Search</label>
    <input :value="value" ref="input" :disabled="loading" :placeholder="placeholder" @input="$emit('input', $event.target.value)" class="border border-gray-600 placeholder-gray-600 w-full rounded-full py-2 px-6 outline-none focus:border-blue-300" type="text" id="search"/>
    <button v-show="value" @click="$emit('clear')" class="absolute right-0 rounded-full text-gray-600 focus:outline-none hover:text-red-800 hover:bg-red-200 p-2 mr-1" title="Clear (Esc)">
        <svg class="w-4 h-4" id="i-close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.5">
            <path d="M2 30 L30 2 M30 30 L2 2"/>
        </svg>
    </button>
  </div>`,
  computed: {
    headerClasses () {
      return {
        'opacity-0': this.scrollingDown,
        'shadow-md': this.lastScrollPosition > 0
      }
    },
    placeholder () {
      return this.loading ? 'loading data…' : 'type a search query…'
    }
  },
  methods: {
    focus () {
      this.$refs.input.focus()
    },
    handleScroll () {
      this.scrollingDown = window.scrollY > this.lastScrollPosition
      this.lastScrollPosition = window.scrollY
    }
  }
})

// endregion

// region ITEMS

Vue.component('search-item', {
  props: ['item'],
  template: `
<div class="mt-3 border rounded-lg py-3 px-6 space-y-3">
    <item-header :item="item"></item-header>
    <p v-if="'string' === typeof item.desc">{{ item.desc }}</p>
    <p v-else v-for="paragraph in item.desc" :key="paragraph">{{paragraph}}</p>
</div>`
})

Vue.component('abilities', {
  props: ['item'],
  template: `
<div class="mt-3 border rounded-lg py-3 px-6 space-y-3">
    <item-header :item="item" :header="item.name+' ('+item.short_name+')'"></item-header>
    <p v-for="paragraph in item.desc" :key="paragraph">{{paragraph}}</p>
    <links-section :item="item" section="skills"></links-section>
</div>`
})

Vue.component('classes', {
  props: ['item'],
  template: `
<div class="mt-3 border rounded-lg py-3 px-6 space-y-3">
    <item-header :item="item"></item-header>
    <p><strong class="font-semibold">Hit Die:</strong> d{{item.hit_die}}</span></p>
    <p>
        <strong class="font-semibold">Saving Throws Proficiencies:</strong>
        {{ item.saving_throws.map(st=>st.name).join(', ') }}
    </p>
    <p v-if="item.spellcasting.class" class="-ml-1"><item-link :linkTo="'Spellcasting ('+item.spellcasting.class+')'"></item-link></p>
    <links-section :item="item" section="proficiencies"></links-section>
    <div v-if="item.proficiency_choices.length">
        <h3 class="font-bold">Proficiency options</h3>
        <div v-for="option in item.proficiency_choices">
            <h4 class="font-bold text-sm">Choose {{option.choose}}</h4>
            <p class="flex flex-wrap -ml-1">
                <item-link v-for="link in option.from.map(o=>o.name)" :linkTo="link" :key="link"></item-link>
            </p>
        </div>
    </div>

    <links-section :item="item" section="subclasses"></links-section>
</div>`
})

Vue.component('equipment', {
  props: ['item'],
  template: `
<div class="mt-3 border rounded-lg py-3 px-6 space-y-3">
    <item-header :item="item"></item-header>
    <p v-for="paragraph in item.desc" :key="paragraph">{{paragraph}}</p>
    <p><strong class="font-semibold">Cost:</strong> {{item.cost.quantity}} {{item.cost.unit}}</p>
    <p v-if="item.weight"><strong class="font-semibold">Weight:</strong> {{item.weight}} lb</p>
    <p v-if="item.speed"><strong class="font-semibold">Speed:</strong> {{item.speed.quantity}} {{item.speed.unit}}</p>
    <p v-if="item.capacity"><strong class="font-semibold">Capacity:</strong> {{item.capacity.quantity}}</p>
    <p v-if="item.tool_category"><strong class="font-semibold">Tool category:</strong> {{item.tool_category}}</p>
    <p v-if="item.gear_category"><strong class="font-semibold">Gear category:</strong> {{item.gear_category}}</p>
    <p v-if="item.vehicle_category"><strong class="font-semibold">Vehicle category:</strong> {{item.vehicle_category}}</p>
    <p>
        <strong class="font-semibold">Category:</strong>
        <item-link :linkTo="item.equipment_category"></item-link>
    </p>
    
    <template v-if="item.category_range">
        <p><strong class="font-semibold">Weapon type:</strong> {{item.category_range}}</p>

        <p>
            <strong class="font-semibold">Damage:</strong> {{item.damage.damage_dice}}
            <span v-if="item['2h_damage']">({{item['2h_damage'].damage_dice}} two–handed)</span>
            {{item.damage.damage_type.name}}
        </p>

        <p>
            <strong class="font-semibold">Range:</strong>
            {{item.range.normal + (item.range.long?'/'+item.range.long:'')}} ft
        </p>

        <links-section :item="item" section="properties"></links-section>
    </template>
        
    <template v-if="item.armor_category">
        <p><strong class="font-semibold">Armor type:</strong> {{item.armor_category}}</p>

        <p>
            <strong class="font-semibold">Armor class:</strong> {{item.armor_class.base}}
            <span v-if="item.armor_class.dex_bonus">
                + Dexterity modifier <span v-if="item.armor_class.max_bonus">(maximum {{item.armor_class.max_bonus}})</span>
            </span>
        </p>

        <p v-if="item.str_minimum"><strong class="font-semibold">Strength required:</strong> {{item.str_minimum}}</p>
        <p v-if="item.stealth_disadvantage"><strong class="font-semibold">Stealth:</strong> disadvantage</p>
    </template>
</div>`
})

Vue.component('features', {
  props: ['item'],
  template: `
<div class="mt-3 border rounded-lg py-3 px-6 space-y-3">
    <item-header :item="item"></item-header>
    <p>
        <strong class="font-semibold">Class:</strong> 
        <item-link v-if="item.subclass.name" :linkTo="item.subclass.name"></item-link> 
        <item-link :linkTo="item.class.name"></item-link> 
        <span v-if="item.level">level {{item.level}}</span>
    </p>
    <p v-for="paragraph in item.desc" :key="paragraph">{{paragraph}}</p>
    <p v-if="item.group"><strong class="font-semibold">Group:</strong> {{item.group}}</p>
</div>`
})

Vue.component('languages', {
  props: ['item'],
  template: `
<div class="mt-3 border rounded-lg py-3 px-6 space-y-3">
    <item-header :item="item"></item-header>
    <p>{{item.desc}}</p>
    <p><strong class="font-semibold">Type:</strong> {{item.type}}</p>
    <p><strong class="font-semibold">Speakers:</strong> {{item.typical_speakers.join(', ')}}</p>
    <p><strong class="font-semibold">Script:</strong> {{item.script || 'N/A'}}</p>
</div>`
})

Vue.component('monsters', {
  props: ['item'],
  template: `
<div class="mt-3 border rounded-lg py-3 px-6 space-y-3">
    <item-header :item="item"></item-header>
    
    <p>
        {{item.size}} {{item.type}}<span v-if="item.subtype"> ({{item.subtype}})</span>, {{item.alignment}}
    </p>
    
    <p><strong class="font-semibold">Armor Class</strong> {{item.armor_class}}</p>
    <p><strong class="font-semibold">Hit Points</strong> {{item.hit_points}} ({{item.hit_dice}}<span v-if="hitBonus"> {{hitBonus>0?'+':'-'}} {{Math.abs(hitBonus)}}</span>)</p>
    <p>
        <strong class="font-semibold">Speed</strong>
        <span v-for="(value, type, index) in item.speed"><span v-if="index != 0">, </span>{{type}} {{value}}</span>
    </p>
    
    <div class="flex justify-between text-center">
        <span><strong class="font-semibold">STR</strong><br />{{item.strength}} ({{modifier(item.strength)}})</span>
        <span><strong class="font-semibold">DEX</strong><br />{{item.dexterity}} ({{modifier(item.dexterity)}})</span>
        <span><strong class="font-semibold">CON</strong><br />{{item.constitution}} ({{modifier(item.constitution)}})</span>
        <span><strong class="font-semibold">INT</strong><br />{{item.intelligence}} ({{modifier(item.intelligence)}})</span>
        <span><strong class="font-semibold">WIS</strong><br />{{item.wisdom}} ({{modifier(item.wisdom)}})</span>
        <span><strong class="font-semibold">CHA</strong><br />{{item.charisma}} ({{modifier(item.charisma)}})</span>
    </div>
    
    <p v-if="savingThrows"><strong class="font-semibold">Saving Throws</strong> {{savingThrows}}</p>
    <p v-if="skills"><strong class="font-semibold">Skills</strong> {{skills}}</p>
    <p v-if="item.damage_vulnerabilities.length"><strong class="font-semibold">Damage vulnerabilities</strong> {{item.damage_vulnerabilities.join(', ')}}</p>
    <p v-if="item.damage_resistances.length"><strong class="font-semibold">Damage resistances</strong> {{item.damage_resistances.join(', ')}}</p>
    <p v-if="item.damage_immunities.length"><strong class="font-semibold">Damage immunities</strong> {{item.damage_immunities.join(', ')}}</p>
    <p v-if="item.condition_immunities.length"><strong class="font-semibold">Condition immunities</strong> {{item.condition_immunities.map(ci=>ci.name).join(', ')}}</p>
    <p>
        <strong class="font-semibold">Senses</strong>
        <span v-for="(value, type, index) in item.senses"><span v-if="index != 0">, </span>{{type.replace('_',' ')}} {{value}}</span>
    </p>
    <p v-if="item.languages"><strong class="font-semibold">Languages</strong> {{item.languages}}</p>
    <p><strong class="font-semibold">Challenge</strong> {{item.challenge_rating}}</p>
    <p v-for="ability in item.special_abilities">
        <strong class="font-semibold">{{ability.name}}<span v-if="ability.dc"> ({{ability.dc.dc_type.name}} {{ability.dc.dc_value}})</span>.</strong> {{ability.desc}}
    </p>
    
    <h3 class="font-semibold text-lg">Actions</h3>
    <p v-for="action in item.actions"><strong class="font-semibold">{{action.name}}<span v-if="action.usage"> ({{action.usage.times}} {{action.usage.type}})</span>.</strong> {{action.desc}}</p>
    
    <template v-if="item.legendary_actions">
        <h3 class="font-semibold text-lg">Legendary Actions</h3>
        <p v-for="action in item.legendary_actions"><strong class="font-semibold">{{action.name}}.</strong> {{action.desc}}</p>
    </template>    
</div>`,
  computed: {
    hitBonus () {
      const [dices, size] = this.item.hit_dice.split('d')
      const diceAverage = (parseInt(size) + 1) / 2

      return Math.round(this.item.hit_points - (parseInt(dices) * diceAverage))
    },
    savingThrows () {
      return this.item.proficiencies
        .filter(p => p.name.includes('Saving Throw: '))
        .map(p => `${p.name.replace('Saving Throw: ', '')} +${p.value}`)
        .join(', ')
    },
    skills () {
      return this.item.proficiencies
        .filter(p => p.name.includes('Skill: '))
        .map(p => `${p.name.replace('Skill: ', '')} +${p.value}`)
        .join(', ')
    }
  },
  methods: {
    modifier (score) {
      const modifier = Math.floor((score - 10) / 2)
      const sign = modifier >= 0 ? '+' : ''
      return sign + modifier
    }
  }
})

Vue.component('proficiencies', {
  props: ['item'],
  template: `
<div class="mt-3 border rounded-lg py-3 px-6 space-y-3">
    <item-header :item="item"></item-header>
    <p><strong class="font-semibold">Type: </strong> {{item.type}}</p>
    <links-section v-if="item.classes.length" :item="item" section="classes"></links-section>
    <links-section v-if="item.races.length" :item="item" section="races"></links-section>
</div>`
})

Vue.component('races', {
  props: ['item'],
  template: `
<div class="mt-3 border rounded-lg py-3 px-6 space-y-3">
    <item-header :item="item"></item-header>
    
     <p><strong class="font-semibold">Speed:</strong> {{item.speed}} ft.</p>

        <p>
            <strong class="font-semibold">Ability bonuses:</strong>
            <span v-for="bonus in item.ability_bonuses"> {{bonus.name}}+{{bonus.bonus}}</span>
        </p>
        
        <p v-if="item.ability_bonus_options.choose">
            <strong class="font-semibold">Ability options (choose {{item.ability_bonus_options.choose}}):</strong>
            <span v-for="bonus in item.ability_bonus_options.from"> {{bonus.name+'+'+bonus.bonus}}</span>
        </p>

        <p><strong class="font-semibold">Alignment:</strong> {{item.alignment}}</p>
        <p><strong class="font-semibold">Age:</strong> {{item.age}}</p>
        <p><strong class="font-semibold">Size:</strong> {{item.size_description}}</p>

        <div>
            <h3 class="font-bold">Languages</h3>
            <p>{{item.language_desc}}</p>
            <links-section :item="item" section="languages" header=""></links-section>
        </div>

        <links-section :item="item" section="starting_proficiencies" header="Proficiencies"></links-section>
    
        <div v-if="item.starting_proficiency_options.from">
            <h3 class="font-bold">Proficiency options (choose {{item.starting_proficiency_options.choose}})</h3>
            <p class="flex flex-wrap -ml-1">
                <item-link v-for="link in item.starting_proficiency_options.from" :linkTo="link.name" :key="link.name"></item-link>
            </p>
        </div>
    
        <links-section :item="item" section="subraces"></links-section>
        <links-section :item="item" section="traits"></links-section>
</div>`
})

Vue.component('spellcasting', {
  props: ['item'],
  template: `
<div class="mt-3 border rounded-lg py-3 px-6 space-y-3">
    <item-header :item="item"></item-header>
    <p><strong class="font-semibold">Level</strong> {{item.level}}</p>
    <template v-for="info in item.info">
        <h3 class="font-bold">{{info.name}}</h3>
        <p v-for="paragraph in info.desc">{{paragraph}}</p>
    </template>
</div>`
})

Vue.component('spells', {
  props: ['item'],
  template: `
<div class="mt-3 border rounded-lg py-3 px-6 space-y-3">
    <item-header :item="item"></item-header>

    <p><strong class="font-semibold">Level:</strong> {{item.level>0?item.level:'cantrip'}}</p>
    <p><strong class="font-semibold">School:</strong> {{item.school.name}}</p>
    <p>
        <strong class="font-semibold">Casting time:</strong> {{item.casting_time}} 
        <span v-if="item.ritual">(+10 minutes as <strong class="font-semibold">ritual</strong>)</span>
        <span v-if="item.concentration">and <strong class="font-semibold">concentration</strong> required</span>
    </p>
    <p><strong class="font-semibold">Duration:</strong> {{item.duration}}</p>
    <p><strong class="font-semibold">Range:</strong> {{item.range}}</p>
    <p><strong class="font-semibold">Components:</strong> 
        <span v-for="c in item.components" :key="c"> {{c.replace('V','Verbal').replace('S','Somatic').replace('M','Material')}}</span>
    </p>
    <p v-if="item.material"><strong class="font-semibold">Material:</strong> {{item.material}}</p>

    <p v-for="paragraph in item.desc" :key="paragraph">{{paragraph}}</p>
    
    <div v-if="item.higher_level">
        <h3 class="font-bold">Higher level</h3>
        <p v-for="paragraph in item.higher_level">{{paragraph}}</p>
    </div>
    
    <links-section :item="item" section="classes"></links-section>
    <links-section :item="item" section="subclasses"></links-section>
</div>`
})

Vue.component('subclasses', {
  props: ['item'],
  template: `
<div class="mt-3 border rounded-lg py-3 px-6 space-y-3">
    <item-header :item="item" :header="item.name+' '+item.class.name"></item-header>
    <p v-for="paragraph in item.desc" :key="paragraph">{{paragraph}}</p>
        <p><strong class="font-semibold">Class:</strong> <item-link :linkTo="item.class.name"></item-link></p>
        <p><strong class="font-semibold">Flavor:</strong> {{item.subclass_flavor}}</p>
        <links-section :item="item" section="features"></links-section> 
</div>`
})

Vue.component('subraces', {
  props: ['item'],
  template: `
<div class="mt-3 border rounded-lg py-3 px-6 space-y-3">
    <item-header :item="item"></item-header>
    <p>{{item.desc}}</p>

    <p><strong class="font-semibold">Race:</strong> <item-link :linkTo="item.race.name"></item-link></p>

    <p>
        <strong class="font-semibold">Ability bonuses:</strong>
        <span v-for="bonus in item.ability_bonuses">{{bonus.name+'+'+bonus.bonus}}</span>
    </p>

    <links-section :item="item" section="starting_proficiencies" header="Proficiencies"></links-section>
    <links-section :item="item" section="racial_traits" header="Traits"></links-section>
</div>`
})

Vue.component('traits', {
  props: ['item'],
  template: `
<div class="mt-3 border rounded-lg py-3 px-6 space-y-3">
    <item-header :item="item"></item-header>
    <p v-for="paragraph in item.desc" :key="paragraph">{{paragraph}}</p>   
    <links-section :item="item" section="races"></links-section>
    <links-section :item="item" section="subraces"></links-section>
</div>`
})

// endregion

// region HELPERS

Vue.component('item-header', {
  props: ['item', 'header'],
  template: `
<div class="flex justify-between items-center font-bold text-lg">
    <h2 class="font-serif text-2xl">{{ headerText }}</h2>
    <type-link :type="item.search_type"></type-link>
</div>`,
  computed: {
    headerText () {
      return this.header || this.item.name
    }
  }
})

Vue.component('links-section', {
  props: { item: Object, header: String, section: String, field: String },
  template: `
<div v-if="destinations.length">
    <h3 v-if="''!==header" class="font-bold">{{headerText}}</h3>
    <p class="flex flex-wrap -ml-1">
        <item-link v-for="link in destinations" :linkTo="link" :key="link"></item-link>
    </p>
</div>`,
  computed: {
    headerText () {
      return this.header || this.section.charAt(0).toUpperCase() + this.section.slice(1)
    },
    destinations () {
      const field = this.field ? this.field : 'name'
      return this.item[this.section].length ? this.item[this.section].map(i => i[field]) : []
    }
  }
})

Vue.component('item-link', {
  props: ['linkTo'],
  template: '<a class="font-semibold bg-gray-200 hover:bg-blue-100 hover:text-blue-600 py-1 px-2 m-1 rounded-lg" :href="\'#\'+link">{{link}}</a>',
  computed: {
    link () {
      return this.linkTo.replace('Skill: ', '')
    }
  }
})

Vue.component('type-link', {
  props: ['type'],
  template: '<a class="text-gray-600 font-semibold py-1 px-2 rounded-lg hover:bg-blue-100 hover:text-blue-600" :href="\'#\'+type">{{type}}</a>'
})
// endregion

new Vue({ el: '#app' }) // eslint-disable-line no-new
