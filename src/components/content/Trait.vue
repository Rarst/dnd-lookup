<template>
  <div class="mt-3 border rounded-lg py-3 px-6 space-y-3">
    <ItemHeader :item="item"></ItemHeader>
    <p v-for="paragraph in item.desc" :key="paragraph">{{ paragraph }}</p>
    <LinksSection :item="item" section="races"></LinksSection>
    <LinksSection :item="item" section="subraces"></LinksSection>
  </div>
</template>

<script>
import ItemHeader from '../ItemHeader.vue'
import LinksSection from '../LinksSection.vue'

export default {
  components: { LinksSection, ItemHeader },
  props: ['item']
}
</script>
