<template>
  <ItemHeader :item="item"></ItemHeader>
  <p><strong class="font-semibold">Hit Die:</strong> d{{ item.hit_die }}</p>
  <p>
    <strong class="font-semibold">Saving Throws Proficiencies:</strong>
    {{ item.saving_throws.map((st) => st.name).join(", ") }}
  </p>

  <div>
    <h3 class="text-lg font-bold">Proficiencies</h3>
    <LinksSection :item="item" header="" section="proficiencies"></LinksSection>
    <div
      v-if="item.proficiency_choices.length"
      v-for="option in item.proficiency_choices"
    >
      <h4 class="font-bold">Choose {{ option.choose }}</h4>
      <p class="-ml-1 flex flex-wrap">
        <ItemLink
          v-for="link in option.from.map((o) => o.name)"
          :linkTo="link"
          :key="link"
        ></ItemLink>
      </p>
    </div>
  </div>

  <template v-if="item.spellcasting">
    <h3 class="text-lg font-bold">Spellcasting</h3>
    <p>
      <strong class="font-semibold">Level</strong>
      {{ item.spellcasting.level }}
    </p>
    <template v-for="info in item.spellcasting.info">
      <h4 class="font-bold">{{ info.name }}</h4>
      <p v-for="paragraph in info.desc">{{ paragraph }}</p>
    </template>
  </template>

  <LinksSection :item="item" section="subclasses"></LinksSection>
</template>

<script>
import ItemHeader from "../ItemHeader.vue";
import LinksSection from "../LinksSection.vue";
import ItemLink from "../ItemLink.vue";

export default {
  components: { ItemLink, LinksSection, ItemHeader },

  props: ["item"],
};
</script>
