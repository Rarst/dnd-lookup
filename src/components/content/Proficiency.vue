<template>
  <div class="mt-3 border rounded-lg py-3 px-6 space-y-3">
    <ItemHeader :item="item"></ItemHeader>
    <p><strong class="font-semibold">Type: </strong> {{ item.type }}</p>
    <LinksSection v-if="item.classes.length" :item="item" section="classes"></LinksSection>
    <LinksSection v-if="item.races.length" :item="item" section="races"></LinksSection>
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
