<template>
  <ItemHeader :item="item"></ItemHeader>

  <p>
    <strong class="font-semibold">Level:</strong>
    {{ item.level > 0 ? item.level : "cantrip" }}
  </p>
  <p><strong class="font-semibold">School:</strong> {{ item.school.name }}</p>
  <p>
    <strong class="font-semibold">Casting time:</strong> {{ item.casting_time }}
    <span v-if="item.ritual"
      >(+10 minutes as <strong class="font-semibold">ritual</strong>)</span
    >
    <span v-if="item.concentration"
      >and <strong class="font-semibold">concentration</strong> required</span
    >
  </p>
  <p><strong class="font-semibold">Duration:</strong> {{ item.duration }}</p>
  <p><strong class="font-semibold">Range:</strong> {{ item.range }}</p>
  <p>
    <strong class="font-semibold">Components: </strong>
    <span v-for="c in item.components" :key="c">
      {{
        c
          .replace("V", "Verbal ")
          .replace("S", "Somatic ")
          .replace("M", "Material ")
      }}</span
    >
  </p>
  <p v-if="item.material">
    <strong class="font-semibold">Material:</strong> {{ item.material }}
  </p>

  <p v-for="paragraph in item.desc" :key="paragraph">{{ paragraph }}</p>

  <div v-if="item.higher_level">
    <h3 class="text-xl font-bold">Higher level</h3>
    <p v-for="paragraph in item.higher_level">{{ paragraph }}</p>
  </div>

  <LinksSection :item="item" section="classes"></LinksSection>
  <LinksSection :item="item" section="subclasses"></LinksSection>
</template>

<script>
import ItemHeader from "../ItemHeader.vue";
import LinksSection from "../LinksSection.vue";

export default {
  components: { LinksSection, ItemHeader },
  props: ["item"],
};
</script>
