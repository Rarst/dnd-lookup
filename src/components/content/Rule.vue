<template>
  <div class="space-y-3">
    <ItemHeader :item="item"></ItemHeader>
    <div v-html="content" class="prose"></div>
    <LinksSection
      v-if="item.subsections"
      :item="item"
      header="Sections"
      section="subsections"
    />
  </div>
</template>

<script>
import { marked } from "marked";

export default {
  props: ["item"],
  computed: {
    content() {
      let content = this.item.desc;
      content = content.replace(new RegExp(`^#+ ${this.item.name}[\?]*`), "");
      content = marked.parse(content);

      return content;
    },
  },
};
</script>
