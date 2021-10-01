<template>
  <ItemHeader :item="item"></ItemHeader>

  <p><strong class="font-semibold">Speed:</strong> {{ item.speed }} ft.</p>

  <p>
    <strong class="font-semibold">Ability bonuses: </strong>
    <span v-for="bonus in item.ability_bonuses"> {{ bonus.ability_score.name }}+{{ bonus.bonus }}</span>
  </p>

  <p v-if="item.ability_bonus_options">
    <strong class="font-semibold">Ability options (choose {{ item.ability_bonus_options.choose }}):</strong>
    <span v-for="bonus in item.ability_bonus_options.from"> {{ bonus.name + '+' + bonus.bonus }}</span>
  </p>

  <p><strong class="font-semibold">Alignment:</strong> {{ item.alignment }}</p>
  <p><strong class="font-semibold">Age:</strong> {{ item.age }}</p>
  <p><strong class="font-semibold">Size:</strong> {{ item.size_description }}</p>

  <div>
    <h3 class="font-bold">Languages</h3>
    <p>{{ item.language_desc }}</p>
    <LinksSection :item="item" section="languages" header=""></LinksSection>
  </div>

  <LinksSection :item="item" section="starting_proficiencies" header="Proficiencies"></LinksSection>

  <div v-if="item.starting_proficiency_options">
    <h3 class="font-bold">Proficiency options (choose {{ item.starting_proficiency_options.choose }})</h3>
    <p class="flex flex-wrap -ml-1">
      <ItemLink v-for="link in item.starting_proficiency_options.from" :linkTo="link.name" :key="link.name"></ItemLink>
    </p>
  </div>

  <links-section :item="item" section="subraces"></links-section>
  <links-section :item="item" section="traits"></links-section>
</template>

<script>
import ItemHeader from '../ItemHeader.vue'
import LinksSection from '../LinksSection.vue'
import ItemLink from '../ItemLink.vue'

export default {
  components: { ItemLink, LinksSection, ItemHeader },
  props: ['item']
}
</script>
