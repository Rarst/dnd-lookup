<template>
  <ItemHeader :item="item"></ItemHeader>
  <p><strong>Hit Die:</strong> d{{ item.hit_die }}</p>
  <p>
    <strong>Saving Throws Proficiencies:</strong>
    {{ item.saving_throws.map((st) => st.name).join(", ") }}
  </p>

  <div>
    <h3>Proficiencies</h3>
    <LinksSection :item="item" header="" section="proficiencies"></LinksSection>
    <div
      v-if="item.proficiency_choices.length"
      v-for="option in item.proficiency_choices"
    >
      <h4>Choose {{ option.choose }}</h4>
      <p class="-ml-1 flex flex-wrap">
        <template v-for="choice in option.from.options">
          <ItemLink
            v-if="choice.option_type === 'reference'"
            :linkTo="choice.item.name"
            :key="choice.item.name"
          />
          <ItemLink
            v-else-if="choice.option_type === 'choice'"
            v-for="reference in choice.choice.from.options"
            :linkTo="reference.item.name"
            :key="reference.item.name"
          />
        </template>
      </p>
    </div>
  </div>

  <template v-if="item.spellcasting">
    <h3>Spellcasting</h3>
    <p>
      <strong>Level</strong>
      {{ item.spellcasting.level }}
    </p>
    <template v-for="info in item.spellcasting.info">
      <h4>{{ info.name }}</h4>
      <p v-for="paragraph in info.desc">{{ paragraph }}</p>
    </template>
  </template>

  <LinksSection :item="item" section="subclasses"></LinksSection>
</template>

<script>
export default {
  props: ["item"],
};
</script>
