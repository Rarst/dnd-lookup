<template>
  <ItemHeader :item="item"></ItemHeader>
  <p v-for="paragraph in item.desc" :key="paragraph">{{ paragraph }}</p>
  <LinksSection :item="item" section="races"></LinksSection>
  <LinksSection :item="item" section="subraces"></LinksSection>
</template>

<script>
export default {
  props: ["item"],
};
</script>
