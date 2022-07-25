<template>
  <div>
    <ItemHeader :item="item"></ItemHeader>
    <p class="text-lg italic">{{ item.desc[0] }}</p>
  </div>
  <Markdown :markdown="markdown" class="prose" />
  <p>
    <strong>Category:</strong>
    <ItemLink :linkTo="item.equipment_category.name"></ItemLink>
  </p>
</template>

<script>
export default {
  props: ["item"],
  computed: {
    markdown() {
      let markdown = [];

      for (let sentence of this.item.desc.slice(1)) {
        if (sentence[0] === "-" || sentence[0] === "|") {
          // unordered list item or table row
          markdown.push("\n" + sentence);
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
