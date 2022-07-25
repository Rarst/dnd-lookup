<template>
  <div class="space-y-3">
    <ItemHeader :item="item"></ItemHeader>
    <Markdown :markdown="markdown" class="prose" />
    <LinksSection
      v-if="item.subsections"
      :item="item"
      header="Sections"
      section="subsections"
    />
  </div>
</template>

<script>
export default {
  props: ["item"],
  computed: {
    markdown() {
      return this.item.desc.replace(
        // remove top level header from markdown source
        new RegExp(`^#+ ${this.item.name}[\?]*`),
        ""
      );
    },
  },
};
</script>
