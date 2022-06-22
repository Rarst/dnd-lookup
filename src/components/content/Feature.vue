<template>
  <ItemHeader :item="item"></ItemHeader>
  <p>
    <strong class="font-semibold">Class:</strong>
    <ItemLink
      v-if="item.subclass && item.subclass.name"
      :linkTo="item.subclass.name"
    ></ItemLink>
    <item-link :linkTo="item.class.name"></item-link>
    <span v-if="item.level">level {{ item.level }}</span>
  </p>
  <p v-for="req in item.prerequisites">
    <strong>Prerequisite: </strong>
    <span v-html="prerequisite(req)"></span>
  </p>
  <p v-for="paragraph in item.desc" :key="paragraph">{{ paragraph }}</p>
</template>

<script>
import ItemHeader from "../ItemHeader.vue";
import ItemLink from "../ItemLink.vue";

export default {
  components: { ItemLink, ItemHeader },
  props: ["item"],
  methods: {
    prerequisite(req) {
      if ("Spell" === req.type) {
        let spell = req.spell;
        spell = spell.replace("/api/spells/", "");
        spell = spell.replaceAll("-", " ");
        return `spell <span class="capitalize">${spell}</span>`;
      }

      if ("feature" === req.type) {
        let feature = req.feature;
        feature = feature.replace("/api/features/", "");
        feature = feature.replaceAll("-", " ");
        return `feature <span class="capitalize">${feature}</span>`;
      }

      if ("level" === req.type) {
        return `level ${req.level}`;
      }
    },
  },
};
</script>
