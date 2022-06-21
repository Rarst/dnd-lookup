<template>
  <div v-if="destinations.length">
    <h3 v-if="'' !== header" class="text-xl font-bold">{{ headerText }}</h3>
    <p class="-ml-1 flex flex-wrap">
      <ItemLink
        v-for="link in destinations"
        :linkTo="link"
        :key="link"
      ></ItemLink>
    </p>
  </div>
</template>

<script>
import ItemLink from "./ItemLink.vue";

export default {
  components: { ItemLink },

  props: { item: Object, header: String, section: String, field: String },

  computed: {
    headerText() {
      return (
        this.header ||
        this.section.charAt(0).toUpperCase() + this.section.slice(1)
      );
    },

    destinations() {
      const field = this.field ? this.field : "name";
      return this.item[this.section].length
        ? this.item[this.section].map((i) => i[field])
        : [];
    },
  },
};
</script>
