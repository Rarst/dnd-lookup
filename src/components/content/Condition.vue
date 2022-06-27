<template>
  <div class="space-y-3">
    <ItemHeader :item="item"></ItemHeader>
    <div
      v-html="content"
      class="prose prose-stone max-w-none prose-p:leading-normal prose-ol:-ml-8 prose-ul:-ml-8 prose-li:leading-normal"
    ></div>
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

      content = content.join("");
      content = marked.parse(content);

      return content;
    },
  },
};
</script>
