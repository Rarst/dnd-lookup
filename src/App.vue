<template>
  <div>
    <SearchInput v-model="search" ref="input" :loading="loading" @clear="reset(true)"></SearchInput>

    <div v-show="!results.length" class="flex flex-wrap justify-center mt-3 px-6 text-lg">
      <TypeLink v-for="type in types" :type="type" :key="type"></TypeLink>
    </div>

    <component :is="componentType(item.search_type)" v-for="item in results" :item="item" :key="item.key"></component>
  </div>
</template>

<script>
import data from './srdData.js'
import types from './types.js'

import SearchInput from './components/SearchInput.vue'
import SearchItem from './components/SearchItem.vue'
import TypeLink from './components/TypeLink.vue'

import Ability from './components/content/Ability.vue'
import Class from './components/content/Class.vue'
import Equipment from './components/content/Equipment.vue'
import Feature from './components/content/Feature.vue'
import Language from './components/content/Language.vue'
import Monster from './components/content/Monster.vue'
import Proficiency from './components/content/Proficiency.vue'
import Race from './components/content/Race.vue'
import Spell from './components/content/Spell.vue'
import Subclass from './components/content/Subclass.vue'
import Subrace from './components/content/Subrace.vue'
import Trait from './components/content/Trait.vue'

const showSize = 20

export default {

  components: { SearchInput, SearchItem, TypeLink, Ability, Class, Equipment, Feature, Language, Monster, Proficiency, Race, Spell, Subclass, Subrace, Trait },

  data () {
    return {
      loading: true,
      search: '',
      types: [],
      results: [],
      more: []
    }
  },

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
        this.navigate()
        this.types.sort()
        this.loading = false
        this.$nextTick(() => this.focus())
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
        this.focus()
      }
    },

    focus () {
      this.$refs.input.focus()
    },

    componentType (type) {
      return 'component' in types[type] ? types[type].component : 'SearchItem'
    }
  }
}
</script>
