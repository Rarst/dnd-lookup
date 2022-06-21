<template>
  <a
    class="m-1 rounded-lg bg-stone-200 py-1 px-2 font-semibold transition-colors duration-100 hover:bg-red-100 hover:text-red-700"
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
