<template>
  <ItemHeader :item="item"></ItemHeader>
  <p><strong class="font-semibold">Hit Die:</strong> d{{ item.hit_die }}</p>
  <p>
    <strong class="font-semibold">Saving Throws Proficiencies:</strong>
    {{ item.saving_throws.map(st => st.name).join(', ') }}
  </p>
  <!--    <p v-if="item.spellcasting.class" class="-ml-1"><item-link :linkTo="'Spellcasting ('+item.spellcasting.class+')'"></item-link></p>-->
  <LinksSection :item="item" section="proficiencies"></LinksSection>
  <div v-if="item.proficiency_choices.length">
    <h3 class="font-bold">Proficiency options</h3>
    <div v-for="option in item.proficiency_choices">
      <h4 class="font-bold text-sm">Choose {{ option.choose }}</h4>
      <p class="flex flex-wrap -ml-1">
        <ItemLink v-for="link in option.from.map(o=>o.name)" :linkTo="link" :key="link"></ItemLink>
      </p>
    </div>
  </div>

  <links-section :item="item" section="subclasses"></links-section>
</template>

<script>
import ItemHeader from '../ItemHeader.vue'
import LinksSection from '../LinksSection.vue'
import ItemLink from '../ItemLink.vue'

export default {

  components: { ItemLink, LinksSection, ItemHeader },

  props: ['item'],
}

// TODO spellcasting
// Vue.component('spellcasting', {
//   props: ['item'],
//   template: `
// <div class="mt-3 border rounded-lg py-3 px-6 space-y-3">
//     <item-header :item="item"></item-header>
//     <p><strong class="font-semibold">Level</strong> {{item.level}}</p>
//     <template v-for="info in item.info">
//         <h3 class="font-bold">{{info.name}}</h3>
//         <p v-for="paragraph in info.desc">{{paragraph}}</p>
//     </template>
// </div>`
// })
</script>

