<template>
  <ItemHeader
    :item="item"
    :header="item.name + ' (' + item.short_name + ')'"
  ></ItemHeader>
  <p v-for="paragraph in item.desc" :key="paragraph">{{ paragraph }}</p>
  <LinksSection :item="item" section="skills"></LinksSection>
</template>

<script>
import ItemHeader from "../ItemHeader.vue";
import LinksSection from "../LinksSection.vue";

export default {
  components: { LinksSection, ItemHeader },
  props: ["item"],
};
</script>
