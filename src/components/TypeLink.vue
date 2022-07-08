<template>
  <a
    class="rounded-lg py-1 px-2 text-center font-serif font-semibold text-stone-600 transition-colors duration-200 ease-in-out hover:bg-red-100 hover:text-red-700 dark:text-stone-400 dark:hover:bg-red-900 dark:hover:text-red-600"
    :href="href"
    >{{ type }}</a
  >
</template>

<script>
export default {
  props: ["type"],
  computed: {
    href() {
      return "#" + this.type;
    },
  },
};
</script>
