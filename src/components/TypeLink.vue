<template>
  <a
    class="rounded-lg py-1 px-2 font-semibold text-stone-600 transition-colors duration-100 hover:bg-red-100 hover:text-red-700"
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
