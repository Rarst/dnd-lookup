<template>
  <div v-html="html"></div>
</template>

<script>
import { marked } from "marked";

export default {
  props: {
    markdown: {
      type: String,
      required: true,
    },
  },
  computed: {
    html() {
      return marked.parse(this.markdown);
    },
  },
};
</script>
