<template>
  <div :class="headerClasses" class="flex items-center relative sticky top-0 pt-3 transition-opacity duration-300 rounded-full">
    <label class="sr-only" for="search">Search</label>
    <input :value="modelValue" ref="input" :disabled="loading" :placeholder="placeholder" @input="$emit('update:modelValue', $event.target.value)" class="border border-gray-600 placeholder-gray-600 w-full rounded-full py-2 px-6 outline-none focus:border-blue-300" type="text" id="search"/>
    <button v-show="modelValue" @click="$emit('clear')" class="absolute right-0 rounded-full text-gray-600 focus:outline-none hover:text-red-800 hover:bg-red-200 p-2 mr-1" title="Clear (Esc)">
      <svg class="w-4 h-4" id="i-close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.5">
        <path d="M2 30 L30 2 M30 30 L2 2"/>
      </svg>
    </button>
  </div>
</template>

<script>

export default {

  created () {
    window.addEventListener('scroll', this.handleScroll, { passive: true })
  },

  data () {
    return {
      lastScrollPosition: 0,
      scrollingDown: false
    }
  },

  props: ['modelValue', 'loading'],

  emits: ['update:modelValue', 'clear'],

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
}
</script>
