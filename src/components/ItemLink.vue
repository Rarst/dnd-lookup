<template>
  <a
    class="m-1 rounded-lg bg-gray-200 py-1 px-2 font-semibold hover:bg-blue-100 hover:text-blue-600"
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
