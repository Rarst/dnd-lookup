<template>
  <ItemHeader :item="item"></ItemHeader>
  <p><strong>Type: </strong> {{ item.type }}</p>
  <LinksSection
    v-if="item.classes.length"
    :item="item"
    section="classes"
  ></LinksSection>
  <LinksSection
    v-if="item.races.length"
    :item="item"
    section="races"
  ></LinksSection>
</template>

<script>
export default {
  props: ["item"],
};
</script>
