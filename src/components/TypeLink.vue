<template>
  <a class="text-gray-600 font-semibold py-1 px-2 rounded-lg hover:bg-blue-100 hover:text-blue-600" :href="href">{{ type }}</a>
</template>

<script>
export default {
  props: ['type'],
  computed: {
    href() {
      return '#' + this.type;
    }
  }
}
</script>
