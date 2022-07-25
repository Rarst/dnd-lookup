<template>
  <div class="space-y-3">
    <ItemHeader :item="item"></ItemHeader>
    <Markdown :markdown="markdown" class="prose" />
  </div>
</template>

<script>
export default {
  props: ["item"],
  computed: {
    markdown() {
      let markdown = [];

      for (let sentence of this.item.desc) {
        if (sentence[0] === "-") {
          // unordered list item
          markdown.push("\n" + sentence);
        } else if (sentence.match(/^\d -/)) {
          // ordered list item
          markdown.push("\n" + sentence.replace(/^(\d) -/, "$1."));
        } else {
          // paragraph or another standalone element
          markdown.push("\n\n" + sentence);
        }
      }

      return markdown.join("");
    },
  },
};
</script>
