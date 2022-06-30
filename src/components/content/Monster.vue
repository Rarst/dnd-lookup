<template>
  <div>
    <ItemHeader :item="item"></ItemHeader>

    <p class="italic">
      {{ item.size }} {{ item.type
      }}<span v-if="item.subtype"> ({{ item.subtype }})</span>,
      {{ item.alignment }}
    </p>
  </div>

  <div class="space-y-1 font-sans">
    <hr class="clip-triangle-right h-1 bg-red-900" />

    <p>
      <strong class="font-semibold">Armor Class</strong> {{ item.armor_class }}
    </p>
    <p>
      <strong class="font-semibold">Hit Points</strong>
      {{ item.hit_points }} ({{ item.hit_dice
      }}<span v-if="hitBonus">
        {{ hitBonus > 0 ? "+" : "-" }} {{ Math.abs(hitBonus) }}</span
      >)
    </p>
    <p>
      <strong class="font-semibold">Speed </strong>
      <span v-for="(value, type, index) in item.speed">
        <span v-if="index != 0">, </span>{{ type }} {{ value }}</span
      >
    </p>

    <hr class="clip-triangle-right h-1 bg-red-900" />

    <div class="flex justify-between px-3 text-center">
      <span
        ><strong class="font-semibold">STR</strong><br />{{ item.strength }} ({{
          modifier(item.strength)
        }})</span
      >
      <span
        ><strong class="font-semibold">DEX</strong><br />{{
          item.dexterity
        }}
        ({{ modifier(item.dexterity) }})</span
      >
      <span
        ><strong class="font-semibold">CON</strong><br />{{
          item.constitution
        }}
        ({{ modifier(item.constitution) }})</span
      >
      <span
        ><strong class="font-semibold">INT</strong><br />{{
          item.intelligence
        }}
        ({{ modifier(item.intelligence) }})</span
      >
      <span
        ><strong class="font-semibold">WIS</strong><br />{{ item.wisdom }} ({{
          modifier(item.wisdom)
        }})</span
      >
      <span
        ><strong class="font-semibold">CHA</strong><br />{{ item.charisma }} ({{
          modifier(item.charisma)
        }})</span
      >
    </div>

    <hr class="clip-triangle-right h-1 bg-red-900" />

    <p v-if="savingThrows">
      <strong class="font-semibold">Saving Throws</strong> {{ savingThrows }}
    </p>
    <p v-if="skills">
      <strong class="font-semibold">Skills</strong> {{ skills }}
    </p>
    <p v-if="item.damage_vulnerabilities.length">
      <strong class="font-semibold">Damage vulnerabilities</strong>
      {{ item.damage_vulnerabilities.join(", ") }}
    </p>
    <p v-if="item.damage_resistances.length">
      <strong class="font-semibold">Damage resistances</strong>
      {{ item.damage_resistances.join(", ") }}
    </p>
    <p v-if="item.damage_immunities.length">
      <strong class="font-semibold">Damage immunities</strong>
      {{ item.damage_immunities.join(", ") }}
    </p>
    <p v-if="item.condition_immunities.length">
      <strong class="font-semibold">Condition immunities</strong>
      {{ item.condition_immunities.map((ci) => ci.name).join(", ") }}
    </p>
    <p>
      <strong class="font-semibold">Senses </strong>
      <span v-for="(value, type, index) in item.senses"
        ><span v-if="index != 0">, </span>{{ type.replace("_", " ") }}
        {{ value }}</span
      >
    </p>
    <p>
      <strong class="font-semibold">Languages</strong>
      <span v-if="item.languages">&nbsp;&nbsp;{{ item.languages }}</span>
      <span v-else>&nbsp;&nbsp;—</span>
    </p>
    <p>
      <strong class="font-semibold">Challenge</strong>
      {{ item.challenge_rating }} ({{ xp }} XP)
    </p>

    <hr class="clip-triangle-right h-1 bg-red-900" />
  </div>

  <template v-for="ability in item.special_abilities">
    <template v-if="ability.name === 'Spellcasting'">
      <p class="font-sans">
        <strong class="font-semibold">{{ ability.name }}.</strong>
        The {{ item.name }} is an {{ sc.level }}th-level spellcaster. Its
        spellcasting ability is {{ abilityFull(sc.ability.name) }} (spell save
        DC {{ sc.dc }}, +{{ sc.modifier }} to hit with spell attacks). The
        {{ item.name }} has the following {{ sc.school }} spells prepared:
      </p>
      <ol class="font-sans sm:list-decimal" start="0">
        <li v-if="spellsLevel(0).length">
          Cantrips (at will):
          <ItemLink v-for="spell in spellsLevel(0)" :linkTo="spell" />
        </li>
        <li v-for="(count, level) in sc.slots">
          Level {{ level }} (slots {{ count }}):
          <ItemLink
            v-for="spell in spellsLevel(parseInt(level))"
            :linkTo="spell"
          />
        </li>
      </ol>
    </template>
    <template v-else>
      <p class="font-sans">
        <strong class="font-semibold"
          >{{ ability.name
          }}<span v-if="ability.dc">
            ({{ ability.dc.dc_type.name }} {{ ability.dc.dc_value }})</span
          ><span v-if="ability.usage">{{ usage(ability.usage) }}</span
          >.</strong
        >
        {{ ability.desc }}
      </p>
    </template>
  </template>

  <h3 class="border-b-2 border-stone-200 font-sans">Actions</h3>

  <template v-for="action in item.actions">
    <p
      v-for="(paragraph, index) in action.desc.split('\n\n')"
      class="font-sans"
      :class="{ 'pl-4': index, '-indent-4': index }"
    >
      <strong class="font-semibold" v-if="!index"
        >{{ action.name
        }}<span v-if="action.usage">{{ usage(action.usage) }}</span
        >.</strong
      >
      {{ paragraph }}
    </p>
  </template>

  <template v-if="item.legendary_actions">
    <h3 class="border-b-2 border-stone-200 font-sans">Legendary Actions</h3>

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
      <strong class="font-semibold">{{ action.name }}.</strong>
      {{ action.desc }}
    </p>
  </template>
</template>

<script>
import ItemHeader from "../ItemHeader.vue";
import ItemLink from "../ItemLink.vue";

export default {
  components: { ItemLink, ItemHeader },

  props: ["item"],

  computed: {
    hitBonus() {
      const [dices, size] = this.item.hit_dice.split("d");
      const diceAverage = (parseInt(size) + 1) / 2;

      return Math.round(this.item.hit_points - parseInt(dices) * diceAverage);
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
      return this.item.special_abilities.filter(
        (ability) => ability.name === "Spellcasting"
      )[0].spellcasting;
    },

    xp() {
      return new Intl.NumberFormat().format(this.item.xp);
    },
  },

  methods: {
    abilityFull(abilityShort) {
      const names = {
        CHA: "charisma",
        INT: "intelligence",
        WIS: "wisdom",
      };

      return names[abilityShort];
    },

    modifier(score) {
      const modifier = Math.floor((score - 10) / 2);
      const sign = modifier >= 0 ? "+" : "";
      return sign + modifier;
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
