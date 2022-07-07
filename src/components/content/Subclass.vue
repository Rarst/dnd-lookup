<template>
  <ItemHeader
    :item="item"
    :header="item.name + ' ' + item.class.name"
  ></ItemHeader>
  <p v-for="paragraph in item.desc" :key="paragraph">{{ paragraph }}</p>
  <p>
    <strong>Class:</strong>
    <ItemLink :linkTo="item.class.name"></ItemLink>
  </p>
  <p><strong>Flavor:</strong> {{ item.subclass_flavor }}</p>
</template>

<script>
export default {
  props: ["item"],
};
</script>
