<template>
  <div class="mt-3 border rounded-lg py-3 px-6 space-y-3">
    <ItemHeader :item="item" :header="item.name+' '+item.class.name"></ItemHeader>
    <p v-for="paragraph in item.desc" :key="paragraph">{{ paragraph }}</p>
    <p><strong class="font-semibold">Class:</strong>
      <ItemLink :linkTo="item.class.name"></ItemLink>
    </p>
    <p><strong class="font-semibold">Flavor:</strong> {{ item.subclass_flavor }}</p>
  </div>
</template>

<script>
import ItemHeader from '../ItemHeader.vue'
import ItemLink from '../ItemLink.vue'
import LinksSection from '../LinksSection.vue'

export default {
  components: { LinksSection, ItemLink, ItemHeader },
  props: ['item']
}
</script>
