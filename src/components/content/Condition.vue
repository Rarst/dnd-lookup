<template>
  <div class="space-y-3">
    <ItemHeader :item="item"></ItemHeader>
    <div v-html="content" class="prose"></div>
  </div>
</template>

<script>
import ItemHeader from "../ItemHeader.vue";
import { marked } from "marked";

export default {
  components: {
    ItemHeader,
  },
  props: ["item"],
  computed: {
    content() {
      let content = [];

      for (let sentence of this.item.desc) {
        if (sentence[0] === "-") {
          // unordered list item
          content.push("\n" + sentence);
        } else if (sentence.match(/^\d -/)) {
          // ordered list item
          content.push("\n" + sentence.replace(/^(\d) -/, "$1."));
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
