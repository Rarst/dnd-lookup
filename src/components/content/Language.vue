<template>
  <ItemHeader :item="item"></ItemHeader>
  <p>{{ item.desc }}</p>
  <p><strong>Type:</strong> {{ item.type }}</p>
  <p>
    <strong>Speakers:</strong>
    {{ item.typical_speakers.join(", ") }}
  </p>
  <p><strong>Script:</strong> {{ item.script || "N/A" }}</p>
</template>

<script>
export default {
  props: ["item"],
};
</script>
