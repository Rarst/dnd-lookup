<template>
  <div class="flex justify-between items-center font-bold text-lg">
    <h2 class="font-serif text-2xl">{{ headerText }}</h2>
    <TypeLink :type="item.search_type"></TypeLink>
  </div>
</template>

<script>
import TypeLink from './TypeLink.vue'

export default {
  components: { TypeLink },
  props: ['item', 'header'],
  computed: {
    headerText () {
      return this.header || this.item.name
    }
  }
}
</script>
