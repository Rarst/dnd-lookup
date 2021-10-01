<template>
  <ItemHeader :item="item"></ItemHeader>
  <p v-for="paragraph in item.desc" :key="paragraph">{{ paragraph }}</p>
  <p>
    <strong class="font-semibold">Category:</strong>
    <ItemLink :linkTo="item.equipment_category.name"></ItemLink>
  </p>

</template>

<script>
import ItemHeader from '../ItemHeader.vue'
import ItemLink from '../ItemLink.vue'

export default {
  components: { ItemLink, ItemHeader },
  props: ['item']
}
</script>
