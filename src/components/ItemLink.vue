<template>
  <a
    class="m-1 inline-block rounded-lg bg-stone-200 py-1 px-2 text-center font-serif font-semibold transition-colors hover:bg-red-100 hover:text-red-700 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-red-900 dark:hover:text-red-600"
    :href="'#' + link"
    >{{ link }}</a
  >
</template>

<script>
export default {
  props: ["linkTo"],
  computed: {
    link() {
      return this.linkTo.replace("Skill: ", "");
    },
  },
};
</script>
