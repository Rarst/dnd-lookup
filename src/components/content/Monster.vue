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

    <div class="flex justify-between text-center">
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
    <p v-if="item.languages">
      <strong class="font-semibold">Languages</strong> {{ item.languages }}
    </p>
    <p>
      <strong class="font-semibold">Challenge</strong>
      {{ item.challenge_rating }}
    </p>

    <hr class="clip-triangle-right h-1 bg-red-900" />
  </div>

  <p class="font-sans" v-for="ability in item.special_abilities">
    <strong class="font-semibold"
      >{{ ability.name
      }}<span v-if="ability.dc">
        ({{ ability.dc.dc_type.name }} {{ ability.dc.dc_value }})</span
      >.</strong
    >
    {{ ability.desc }}
  </p>

  <h3 class="border-b-2 border-stone-200 text-xl font-semibold">Actions</h3>

  <p class="font-sans" v-for="action in item.actions">
    <strong class="font-semibold"
      >{{ action.name
      }}<span v-if="action.usage">
        ({{ action.usage.times }} {{ action.usage.type }})</span
      >.</strong
    >
    {{ action.desc }}
  </p>

  <template v-if="item.legendary_actions">
    <h3 class="border-b-2 border-stone-200 text-xl font-semibold">
      Legendary Actions
    </h3>
    <p class="font-sans" v-for="action in item.legendary_actions">
      <strong class="font-semibold">{{ action.name }}.</strong>
      {{ action.desc }}
    </p>
  </template>
</template>

<script>
import ItemHeader from "../ItemHeader.vue";

export default {
  components: { ItemHeader },

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
  },

  methods: {
    modifier(score) {
      const modifier = Math.floor((score - 10) / 2);
      const sign = modifier >= 0 ? "+" : "";
      return sign + modifier;
    },
  },
};
</script>
