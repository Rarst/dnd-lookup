<template>
  <div
    class="flex items-center justify-between border-b-4 border-stone-200 font-bold dark:border-stone-600"
  >
    <h2 class="font-serif-sc text-2xl text-red-800 dark:text-red-500">
      {{ headerText }}
    </h2>
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
