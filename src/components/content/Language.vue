<template>
  <div class="mt-3 border rounded-lg py-3 px-6 space-y-3">
    <ItemHeader :item="item"></ItemHeader>
    <p>{{ item.desc }}</p>
    <p><strong class="font-semibold">Type:</strong> {{ item.type }}</p>
    <p><strong class="font-semibold">Speakers:</strong> {{ item.typical_speakers.join(', ') }}</p>
    <p><strong class="font-semibold">Script:</strong> {{ item.script || 'N/A' }}</p>
  </div>
</template>

<script>
import ItemHeader from '../ItemHeader.vue'

export default {
  components: { ItemHeader },
  props: ['item']
}
</script>
