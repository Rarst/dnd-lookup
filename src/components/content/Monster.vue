<template>
  <div class="space-y-3 font-sans">
    <div>
      <ItemHeader :item="item"></ItemHeader>

      <p class="text-lg italic">
        {{ item.size }} {{ item.type
        }}<span v-if="item.subtype"> ({{ item.subtype }})</span>,
        {{ item.alignment }}
      </p>
    </div>

    <div class="space-y-1">
      <hr class="separator-monster" />

      <p><strong>Armor Class</strong> {{ item.armor_class }}</p>
      <p>
        <strong>Hit Points</strong>
        {{ item.hit_points }} ({{ item.hit_dice }}{{ hitPointBonus }})
      </p>
      <p>
        <strong>Speed </strong>
        <span v-for="(value, type, index) in item.speed">
          <span v-if="index">, </span>{{ type }} {{ value }}</span
        >
      </p>

      <hr class="separator-monster" />

      <div class="flex justify-between px-3 text-center">
        <span v-for="(long, short) in abilities"
          ><strong>{{ short }}</strong
          ><br />{{ item[long] }} ({{ modifier(item[long]) }})</span
        >
      </div>

      <hr class="separator-monster" />

      <p v-if="savingThrows">
        <strong>Saving Throws</strong> {{ savingThrows }}
      </p>
      <p v-if="skills"><strong>Skills</strong> {{ skills }}</p>

      <template
        v-for="type in ['vulnerabilities', 'resistances', 'immunities']"
      >
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
          ><span v-if="index">, </span>{{ type.replace("_", " ") }}
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

      <hr class="separator-monster" />
    </div>

    <template v-for="ability in item.special_abilities">
      <MonsterSpellcasting
        v-if="['Spellcasting', 'Innate Spellcasting'].includes(ability.name)"
        :name="item.name"
        :spellcasting="ability"
      />
      <p
        v-else
        v-for="(paragraph, index) in ability.desc.split(/\n+/)"
        :class="{ '!mt-0 indent-4': index }"
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

    <h3 class="border-b-2 border-stone-200 dark:border-stone-600">Actions</h3>

    <template v-for="action in item.actions">
      <p
        v-for="(paragraph, index) in action.desc.split(/\n+/)"
        :class="{ '!mt-0 indent-4': index }"
      >
        <strong v-if="!index"
          >{{ action.name
          }}<span v-if="action.usage"> {{ usage(action.usage) }}</span
          >.</strong
        >
        {{ paragraph }}
      </p>
    </template>

    <template v-if="item.legendary_actions">
      <h3 class="border-b-2 border-stone-200 dark:border-stone-600">
        Legendary Actions
      </h3>

      <p>
        The {{ item.name }} can take 3 legendary actions, choosing from the
        options below. Only one legendary action option can be used at a time
        and only at the end of another creature’s turn. The
        {{ item.name }} regains spent legendary actions at the start of its
        turn.
      </p>

      <p class="pl-4 -indent-4" v-for="action in item.legendary_actions">
        <strong>{{ action.name }}.</strong>
        {{ action.desc }}
      </p>
    </template>

    <div v-if="item.desc" v-html="flavor" class="p-indent font-serif"></div>
  </div>
</template>

<script>
import MonsterSpellcasting from "./MonsterSpellcasting.vue";
import { marked } from "marked";

export default {
  props: ["item"],
  components: { MonsterSpellcasting },

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

    flavor() {
      return marked.parse(this.item.desc);
    },

    hitPointBonus() {
      const diceNumber = this.item.hit_dice.split("d")[0];
      const conModifier = this.modifier(this.item.constitution);
      const bonus = diceNumber * conModifier;

      if (bonus === 0) {
        return "";
      }

      return bonus > 0 ? "+" + bonus : bonus;
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

    xp() {
      return new Intl.NumberFormat().format(this.item.xp);
    },
  },

  methods: {
    abilityFull(abilityShort) {
      return this.abilities[abilityShort];
    },

    modifier(score) {
      const modifier = Math.floor((score - 10) / 2);
      return modifier >= 0 ? "+" + modifier : modifier;
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
  },
};
</script>
