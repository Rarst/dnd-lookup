<template>
  <template v-if="spellcasting.name === 'Spellcasting'">
    <p>
      <strong>{{ spellcasting.name }}.</strong>
      The {{ name }} is an {{ sc.level }}th-level spellcaster. Its spellcasting
      ability is {{ abilityFull(sc.ability.name) }} (spell save DC {{ sc.dc }},
      +{{ sc.modifier }} to hit with spell attacks). The {{ name }}
      <span v-if="spellsAtWill.length"
        >can cast
        <ItemLink v-for="spell in spellsAtWill" :linkTo="spell.name" /> at will
        and</span
      >
      has the following {{ sc.school }} spells prepared:
    </p>
    <ul class="sm:list-disc">
      <li v-if="spellsLevel(0).length">
        Cantrips (at will):
        <ItemLink v-for="spell in spellsLevel(0)" :linkTo="spell.name" />
      </li>
      <li v-for="(count, level) in sc.slots">
        {{ suffixLevel(level) }} ({{ countSlots(count) }}):
        <template v-for="spell in spellsLevel(parseInt(level))"
          ><ItemLink :linkTo="spell.name" /><span v-if="spell.notes"
            >({{ spell.notes }})</span
          >
        </template>
      </li>
    </ul>
  </template>
  <template v-else-if="spellcasting.name === 'Innate Spellcasting'">
    <p>
      <strong>{{ spellcasting.name }}. </strong>
      The {{ name }}'s spellcasting ability is {{ isc.abilityName }}
      <span v-if="isc.spellAttack"> ({{ isc.spellAttack }})</span>. It can
      innately cast the following spells<span
        v-if="spellcasting.desc.includes('no material components')"
        >, requiring no material components</span
      ><span v-if="isc.components.length === 1 && isc.components[0] === 'V'"
        >, requiring only verbal components</span
      >:
    </p>
    <ul class="marker:text-stone-300 sm:list-disc">
      <li v-if="isc.spellsGrouped['at will']">
        At will:
        <template v-for="spell in isc.spellsGrouped['at will']">
          <ItemLink :linkTo="spell.name" /><span v-if="spell.notes"
            >({{ spell.notes }})</span
          >
        </template>
      </li>
      <template v-for="count in 5">
        <li v-if="isc.spellsGrouped[6 - count]">
          {{ 6 - count }}/day each:
          <template v-for="spell in isc.spellsGrouped[6 - count]">
            <ItemLink :linkTo="spell.name" /><span v-if="spell.notes"
              >({{ spell.notes }})</span
            >
          </template>
        </li>
      </template>
    </ul>
  </template>
</template>

<script>
export default {
  props: ["name", "spellcasting"],
  computed: {
    isc() {
      const isc = this.spellcasting.spellcasting;

      let abilityName = this.abilityFull(isc.ability.name);
      isc.abilityName = abilityName[0].toUpperCase() + abilityName.slice(1);
      isc.components = isc.components_required;

      const spells = {};

      for (let spell of isc.spells) {
        if (spell.usage.type === "at will") {
          if (!spells["at will"]) {
            spells["at will"] = [];
          }
          spells["at will"].push(spell);
        } else {
          let times = spell.usage.times;
          if (!spells[times]) {
            spells[times] = [];
          }

          spells[times].push(spell);
        }
      }

      isc.spellsGrouped = spells;

      const spellAttack = [];

      if (isc.dc) {
        spellAttack.push(`spell save DC ${isc.dc}`);
      }

      if (isc.modifier) {
        spellAttack.push(`+${isc.modifier} to hit with spell attacks`);
      }

      isc.spellAttack = spellAttack.join(", ");

      return isc;
    },

    sc() {
      return this.spellcasting.spellcasting;
    },

    spellsAtWill() {
      return this.sc.spells.filter(
        (spell) => spell.usage && spell.usage.type === "at will"
      );
    },
  },
  methods: {
    abilityFull(abilityShort) {
      const abilities = {
        STR: "Strength",
        DEX: "Dexterity",
        CON: "Constitution",
        INT: "Intelligence",
        WIS: "Wisdom",
        CHA: "Charisma",
      };

      return abilities[abilityShort];
    },

    countSlots(slots) {
      return slots === 1 ? "1 slot" : slots + " slots";
    },

    suffixLevel(level) {
      const suffixes = {
        1: "1st",
        2: "2nd",
        3: "3rd",
      };

      return suffixes[level] ? suffixes[level] + " level" : level + "th level";
    },

    spellsLevel(level) {
      return this.sc.spells.filter(
        (spell) => spell.level === level && !spell.usage
      );
    },
  },
};
</script>
