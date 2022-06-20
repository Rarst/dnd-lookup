<template>
  <div class="flex items-center justify-between text-lg font-bold">
    <h2 class="font-serif text-2xl">{{ headerText }}</h2>
    <TypeLink :type="item.search_type"></TypeLink>
  </div>
</template>

<script>
import TypeLink from "./TypeLink.vue";

export default {
  components: { TypeLink },
  props: ["item", "header"],
  computed: {
    headerText() {
      return this.header || this.item.name;
    },
  },
};
</script>
