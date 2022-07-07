<template>
  <ItemHeader
    :item="item"
    :header="item.name + ' (' + item.short_name + ')'"
  ></ItemHeader>
  <p v-for="paragraph in item.desc" :key="paragraph">{{ paragraph }}</p>
  <LinksSection :item="item" section="skills"></LinksSection>
</template>

<script>
export default {
  props: ["item"],
};
</script>
