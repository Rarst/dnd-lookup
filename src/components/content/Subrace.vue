<template>
  <ItemHeader :item="item"></ItemHeader>
  <p>{{ item.desc }}</p>

  <p><strong class="font-semibold">Race:</strong>
    <ItemLink :linkTo="item.race.name"></ItemLink>
  </p>

  <p>
    <strong class="font-semibold">Ability bonuses:</strong>
    <span v-for="bonus in item.ability_bonuses">{{ bonus.name + '+' + bonus.bonus }}</span>
  </p>

  <LinksSection :item="item" section="starting_proficiencies" header="Proficiencies"></LinksSection>
  <LinksSection :item="item" section="racial_traits" header="Traits"></LinksSection>
</template>

<script>
import ItemHeader from '../ItemHeader.vue'
import ItemLink from '../ItemLink.vue'
import LinksSection from '../LinksSection.vue'

export default {
  components: { LinksSection, ItemLink, ItemHeader },
  props: ['item']
}
</script>
