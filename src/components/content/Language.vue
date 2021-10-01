<template>
  <ItemHeader :item="item"></ItemHeader>
  <p>{{ item.desc }}</p>
  <p><strong class="font-semibold">Type:</strong> {{ item.type }}</p>
  <p><strong class="font-semibold">Speakers:</strong> {{ item.typical_speakers.join(', ') }}</p>
  <p><strong class="font-semibold">Script:</strong> {{ item.script || 'N/A' }}</p>
</template>

<script>
import ItemHeader from '../ItemHeader.vue'

export default {
  components: { ItemHeader },
  props: ['item']
}
</script>
