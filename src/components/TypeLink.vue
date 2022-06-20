<template>
  <a
    class="rounded-lg py-1 px-2 font-semibold text-gray-600 hover:bg-blue-100 hover:text-blue-600"
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
