<template>
  <ItemHeader :item="item"></ItemHeader>
  <p v-for="paragraph in item.desc" :key="paragraph">{{ paragraph }}</p>
  <p v-if="item.cost">
    <strong>Cost:</strong> {{ item.cost.quantity }}
    {{ item.cost.unit }}
  </p>
  <p v-if="item.weight"><strong>Weight:</strong> {{ item.weight }} lb</p>
  <p v-if="item.speed">
    <strong>Speed:</strong> {{ item.speed.quantity }}
    {{ item.speed.unit }}
  </p>
  <p v-if="item.capacity">
    <strong>Capacity:</strong>
    {{ item.capacity.quantity }}
  </p>
  <p v-if="item.tool_category">
    <strong>Tool category:</strong>
    {{ item.tool_category }}
  </p>
  <p v-if="item.gear_category">
    <strong>Gear category:</strong>
    {{ item.gear_category.name }}
  </p>
  <p v-if="item.vehicle_category">
    <strong>Vehicle category:</strong>
    {{ item.vehicle_category }}
  </p>
  <div class="space-y-0" v-if="item.contents">
    <h3>Contents</h3>
    <ul class="list-inside list-disc marker:text-stone-300 sm:list-outside">
      <li v-for="contentsItem in item.contents">
        {{ contentsItem.quantity > 1 ? `${contentsItem.quantity}x ` : "" }}
        {{ contentsItem.item.name }}
      </li>
    </ul>
  </div>
  <p>
    <strong>Category:</strong>
    <ItemLink :linkTo="item.equipment_category.name"></ItemLink>
  </p>

  <template v-if="item.category_range">
    <p>
      <strong>Weapon type:</strong>
      {{ item.category_range }}
    </p>

    <p v-if="item.damage">
      <strong>Damage:</strong>
      {{ item.damage.damage_dice }}
      <span v-if="item.two_handed_damage"
        >({{ item.two_handed_damage.damage_dice }} two–handed)</span
      >
      {{ item.damage.damage_type.name }}
    </p>

    <p>
      <strong>Range:</strong>
      {{ item.range.normal + (item.range.long ? "/" + item.range.long : "") }}
      ft
    </p>

    <LinksSection :item="item" section="properties"></LinksSection>
  </template>

  <template v-if="item.armor_category">
    <p>
      <strong>Armor type:</strong>
      {{ item.armor_category }}
    </p>

    <p>
      <strong>Armor class:</strong>
      {{ item.armor_class.base }}
      <span v-if="item.armor_class.dex_bonus">
        + Dexterity modifier
        <span v-if="item.armor_class.max_bonus"
          >(maximum {{ item.armor_class.max_bonus }})</span
        >
      </span>
    </p>

    <p v-if="item.str_minimum">
      <strong>Strength required:</strong>
      {{ item.str_minimum }}
    </p>
    <p v-if="item.stealth_disadvantage">
      <strong>Stealth:</strong> disadvantage
    </p>
  </template>
</template>

<script>
export default {
  props: ["item"],
};
</script>
