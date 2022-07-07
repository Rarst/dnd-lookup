<template>
  <ItemHeader :item="item"></ItemHeader>
  <p>{{ item.desc }}</p>

  <p>
    <strong>Race:</strong>
    <ItemLink :linkTo="item.race.name"></ItemLink>
  </p>

  <p>
    <strong>Ability bonuses:</strong>
    <span v-for="bonus in item.ability_bonuses"
      >&nbsp;{{ bonus.ability_score.name + " +" + bonus.bonus }}</span
    >
  </p>

  <LinksSection
    :item="item"
    section="starting_proficiencies"
    header="Proficiencies"
  ></LinksSection>
  <LinksSection
    :item="item"
    section="racial_traits"
    header="Traits"
  ></LinksSection>
</template>

<script>
export default {
  props: ["item"],
};
</script>
