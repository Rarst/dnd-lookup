<template>
  <div class="mt-3 border rounded-lg py-3 px-6 space-y-3">
    <ItemHeader :item="item"></ItemHeader>
    <p v-if="'string' === typeof item.desc">{{ item.desc }}</p>
    <p v-else v-for="paragraph in item.desc" :key="paragraph">{{ paragraph }}</p>
  </div>
</template>

<script>
import ItemHeader from './ItemHeader.vue'

export default {
  components: { ItemHeader },
  props: ['item']
}
</script>
