<template>
  <div>
    <ItemHeader :item="item"></ItemHeader>
    <p class="text-lg italic">{{ item.desc[0] }}</p>
  </div>
  <div v-html="content" class="prose"></div>
  <p>
    <strong>Category:</strong>
    <ItemLink :linkTo="item.equipment_category.name"></ItemLink>
  </p>
</template>

<script>
import { marked } from "marked";

export default {
  props: ["item"],
  computed: {
    content() {
      let content = [];

      for (let sentence of this.item.desc.slice(1)) {
        if (sentence[0] === "-" || sentence[0] === "|") {
          // unordered list item or table row
          content.push("\n" + sentence);
        } else {
          // paragraph or another standalone element
          content.push("\n\n" + sentence);
        }
      }

      return marked.parse(content.join(""));
    },
  },
};
</script>
