<template>
  <a class="font-semibold bg-gray-200 hover:bg-blue-100 hover:text-blue-600 py-1 px-2 m-1 rounded-lg" :href="'#'+link">{{ link }}</a>
</template>

<script>
export default {
  props: ['linkTo'],
  computed: {
    link () {
      return this.linkTo.replace('Skill: ', '')
    }
  }
}
</script>
