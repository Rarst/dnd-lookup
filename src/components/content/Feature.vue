<template>
  <ItemHeader :item="item"></ItemHeader>
  <p>
    <strong class="font-semibold">Class:</strong>
    <ItemLink v-if="item.subclass && item.subclass.name" :linkTo="item.subclass.name"></ItemLink>
    <item-link :linkTo="item.class.name"></item-link>
    <span v-if="item.level">level {{ item.level }}</span>
  </p>
  <p v-for="paragraph in item.desc" :key="paragraph">{{ paragraph }}</p>
  <p v-if="item.group"><strong class="font-semibold">Group:</strong> {{ item.group }}</p>
</template>

<script>
import ItemHeader from '../ItemHeader.vue'
import ItemLink from '../ItemLink.vue'

export default {
  components: { ItemLink, ItemHeader },
  props: ['item']
}
</script>
