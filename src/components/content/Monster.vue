<template>
  <div>
    <ItemHeader :item="item"></ItemHeader>

    <p class="font-sans text-lg italic">
      {{ item.size }} {{ item.type
      }}<span v-if="item.subtype"> ({{ item.subtype }})</span>,
      {{ item.alignment }}
    </p>
  </div>

  <div class="space-y-1 font-sans">
    <hr class="clip-triangle-right h-1 border-0 bg-red-900 dark:bg-red-600" />

    <p><strong>Armor Class</strong> {{ item.armor_class }}</p>
    <p>
      <strong>Hit Points</strong>
      {{ item.hit_points }} ({{ item.hit_dice
      }}<span v-if="hitBonus">
        {{ hitBonus > 0 ? "+" : "-" }} {{ Math.abs(hitBonus) }}</span
      >)
    </p>
    <p>
      <strong>Speed </strong>
      <span v-for="(value, type, index) in item.speed">
        <span v-if="index != 0">, </span>{{ type }} {{ value }}</span
      >
    </p>

    <hr class="clip-triangle-right h-1 border-0 bg-red-900 dark:bg-red-600" />

    <div class="flex justify-between px-3 text-center">
      <span v-for="(long, short) in abilities"
        ><strong>{{ short }}</strong
        ><br />{{ item[long] }} ({{ modifier(item[long]) }})</span
      >
    </div>

    <hr class="clip-triangle-right h-1 border-0 bg-red-900 dark:bg-red-600" />

    <p v-if="savingThrows"><strong>Saving Throws</strong> {{ savingThrows }}</p>
    <p v-if="skills"><strong>Skills</strong> {{ skills }}</p>

    <template v-for="type in ['vulnerabilities', 'resistances', 'immunities']">
      <p v-if="item['damage_' + type].length">
        <strong>Damage {{ type }}</strong>
        {{ item["damage_" + type].join(", ") }}
      </p>
    </template>

    <p v-if="item.condition_immunities.length">
      <strong>Condition immunities</strong>
      {{ item.condition_immunities.map((ci) => ci.name).join(", ") }}
    </p>
    <p>
      <strong>Senses </strong>
      <span v-for="(value, type, index) in item.senses"
        ><span v-if="index != 0">, </span>{{ type.replace("_", " ") }}
        {{ value }}</span
      >
    </p>
    <p>
      <strong>Languages</strong>
      <span v-if="item.languages">&nbsp;&nbsp;{{ item.languages }}</span>
      <span v-else>&nbsp;&nbsp;—</span>
    </p>
    <p>
      <strong>Challenge</strong>
      {{ cr }} ({{ xp }} XP)
    </p>

    <hr class="clip-triangle-right h-1 border-0 bg-red-900 dark:bg-red-600" />
  </div>

  <template v-for="ability in item.special_abilities">
    <template v-if="ability.name === 'Spellcasting'">
      <p class="font-sans">
        <strong>{{ ability.name }}.</strong>
        The {{ item.name }} is an {{ sc.level }}th-level spellcaster. Its
        spellcasting ability is {{ abilityFull(sc.ability.name) }} (spell save
        DC {{ sc.dc }}, +{{ sc.modifier }} to hit with spell attacks). The
        {{ item.name }} has the following {{ sc.school }} spells prepared:
      </p>
      <ul class="font-sans sm:list-disc">
        <li v-if="spellsLevel(0).length">
          Cantrips (at will):
          <ItemLink v-for="spell in spellsLevel(0)" :linkTo="spell" />
        </li>
        <li v-for="(count, level) in sc.slots">
          {{ suffixLevel(level) }} ({{ countSlots(count) }}):
          <ItemLink
            v-for="spell in spellsLevel(parseInt(level))"
            :linkTo="spell"
          />
        </li>
      </ul>
    </template>
    <div v-else-if="ability.name === 'Innate Spellcasting'">
      <p class="font-sans">
        <strong>{{ ability.name }}. </strong>
        The {{ item.name }}'s spellcasting ability is {{ isc.abilityName }}
        <span v-if="isc.spellAttack"> ({{ isc.spellAttack }})</span>. It can
        innately cast the following spells<span
          v-if="ability.desc.includes('no material components')"
          >, requiring no material components</span
        ><span v-if="isc.components.length === 1 && isc.components[0] === 'V'"
          >, requiring only verbal components</span
        >:
      </p>
      <ul class="font-sans marker:text-stone-300 sm:list-disc">
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
    </div>
    <template v-else>
      <p
        v-for="(paragraph, index) in ability.desc.split(/\n+/)"
        class="font-sans"
        :class="{ 'indent-4': index }"
      >
        <strong v-if="!index"
          >{{ ability.name
          }}<span v-if="ability.dc">
            ({{ ability.dc.dc_type.name }} {{ ability.dc.dc_value }})</span
          ><span v-if="ability.usage">{{ usage(ability.usage) }}</span
          >.</strong
        >
        {{ paragraph }}
      </p>
    </template>
  </template>

  <h3 class="border-b-2 border-stone-200 font-sans dark:border-stone-600">
    Actions
  </h3>

  <template v-for="action in item.actions">
    <p
      v-for="(paragraph, index) in action.desc.split(/\n+/)"
      class="font-sans"
      :class="{ 'indent-4': index }"
    >
      <strong v-if="!index"
        >{{ action.name
        }}<span v-if="action.usage">{{ usage(action.usage) }}</span
        >.</strong
      >
      {{ paragraph }}
    </p>
  </template>

  <template v-if="item.legendary_actions">
    <h3 class="border-b-2 border-stone-200 font-sans dark:border-stone-600">
      Legendary Actions
    </h3>

    <p class="font-sans">
      The {{ item.name }} can take 3 legendary actions, choosing from the
      options below. Only one legendary action option can be used at a time and
      only at the end of another creature’s turn. The {{ item.name }} regains
      spent legendary actions at the start of its turn.
    </p>

    <p
      class="pl-4 -indent-4 font-sans"
      v-for="action in item.legendary_actions"
    >
      <strong>{{ action.name }}.</strong>
      {{ action.desc }}
    </p>
  </template>
</template>

<script>
export default {
  props: ["item"],

  computed: {
    abilities: () => ({
      STR: "strength",
      DEX: "dexterity",
      CON: "constitution",
      INT: "intelligence",
      WIS: "wisdom",
      CHA: "charisma",
    }),

    cr() {
      const cr = this.item.challenge_rating;
      const crs = {
        0.125: "1/8",
        0.25: "1/4",
        0.5: "1/2",
      };

      return crs[cr] ? crs[cr] : cr;
    },

    hitBonus() {
      const [dices, size] = this.item.hit_dice.split("d");
      const diceAverage = (parseInt(size) + 1) / 2;

      return Math.round(this.item.hit_points - parseInt(dices) * diceAverage);
    },

    isc() {
      const isc = this.item.special_abilities.find(
        (ability) => ability.name === "Innate Spellcasting"
      ).spellcasting;

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

    savingThrows() {
      return this.item.proficiencies
        .filter((p) => p.proficiency.name.includes("Saving Throw: "))
        .map(
          (p) =>
            `${p.proficiency.name.replace("Saving Throw: ", "")} +${p.value}`
        )
        .join(", ");
    },

    skills() {
      return this.item.proficiencies
        .filter((p) => p.proficiency.name.includes("Skill: "))
        .map((p) => `${p.proficiency.name.replace("Skill: ", "")} +${p.value}`)
        .join(", ");
    },

    sc() {
      return this.item.special_abilities.find(
        (ability) => ability.name === "Spellcasting"
      ).spellcasting;
    },

    xp() {
      return new Intl.NumberFormat().format(this.item.xp);
    },
  },

  methods: {
    abilityFull(abilityShort) {
      return this.abilities[abilityShort];
    },

    countSlots(slots) {
      return slots === 1 ? "1 slot" : slots + " slots";
    },

    modifier(score) {
      const modifier = Math.floor((score - 10) / 2);
      const sign = modifier >= 0 ? "+" : "";
      return sign + modifier;
    },

    suffixLevel(level) {
      const suffixes = {
        1: "1st",
        2: "2nd",
        3: "3rd",
      };

      return suffixes[level] ? suffixes[level] + " level" : level + "th level";
    },

    usage(usage) {
      if ("recharge on roll" === usage.type) {
        return ` (Recharge ${usage.min_value}-${usage.dice.split("d")[1]})`;
      }

      if ("per day" === usage.type) {
        return ` (${usage.times}/Day)`;
      }

      if ("recharge after rest" === usage.type) {
        return ` (Recharges after a ${usage.rest_types.join(" or ")} rest)`;
      }

      return ` (${usage.type})`;
    },

    spellsLevel(level) {
      return this.sc.spells
        .filter((spell) => spell.level === level)
        .map((spell) => spell.name);
    },
  },
};
</script>
