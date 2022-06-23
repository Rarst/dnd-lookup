<template>
  <div class="space-y-3">
    <component
      v-if="getComponent(item.search_type)"
      :is="getComponent(item.search_type)"
      :item="item"
    ></component>
    <template v-else>
      <ItemHeader :item="item"></ItemHeader>
      <p v-if="'string' === typeof item.desc">{{ item.desc }}</p>
      <p v-else v-for="paragraph in item.desc" :key="paragraph">
        {{ paragraph }}
      </p>
    </template>
  </div>
</template>

<script>
import types from "../types.js";

import ItemHeader from "./ItemHeader.vue";

import Ability from "./content/Ability.vue";
import Class from "./content/Class.vue";
import Equipment from "./content/Equipment.vue";
import Feature from "./content/Feature.vue";
import Language from "./content/Language.vue";
import MagicItem from "./content/MagicItem.vue";
import Monster from "./content/Monster.vue";
import Proficiency from "./content/Proficiency.vue";
import Race from "./content/Race.vue";
import Rule from "./content/Rule.vue";
import Spell from "./content/Spell.vue";
import Subclass from "./content/Subclass.vue";
import Subrace from "./content/Subrace.vue";
import Trait from "./content/Trait.vue";

export default {
  components: {
    ItemHeader,
    Ability,
    Class,
    Equipment,
    Feature,
    Language,
    MagicItem,
    Monster,
    Proficiency,
    Race,
    Rule,
    Spell,
    Subclass,
    Subrace,
    Trait,
  },
  props: ["item"],
  methods: {
    getComponent(type) {
      return "component" in types[type] ? types[type].component : false;
    },
  },
};
</script>
