<template>
  <ItemHeader :item="item"></ItemHeader>

  <p>
    <strong>Level:</strong>
    {{ item.level > 0 ? item.level : "cantrip" }}
  </p>
  <p><strong>School:</strong> {{ item.school.name }}</p>
  <p>
    <strong>Casting time:</strong> {{ item.casting_time }}
    <span v-if="item.ritual">(+10 minutes as <strong>ritual</strong>)</span>
    <span v-if="item.concentration"
      >and <strong>concentration</strong> required</span
    >
  </p>
  <p><strong>Duration:</strong> {{ item.duration }}</p>
  <p><strong>Range:</strong> {{ item.range }}</p>
  <p>
    <strong>Components: </strong>
    <span v-for="c in item.components" :key="c">
      {{
        c
          .replace("V", "Verbal ")
          .replace("S", "Somatic ")
          .replace("M", "Material ")
      }}</span
    >
  </p>
  <p v-if="item.material"><strong>Material:</strong> {{ item.material }}</p>

  <Markdown :markdown="markdown" class="prose" />

  <div v-if="item.higher_level">
    <h3>Higher level</h3>
    <p v-for="paragraph in item.higher_level">{{ paragraph }}</p>
  </div>

  <LinksSection :item="item" section="classes"></LinksSection>
  <LinksSection :item="item" section="subclasses"></LinksSection>
</template>

<script>
export default {
  props: ["item"],
  computed: {
    markdown() {
      let markdown = [];

      for (let sentence of this.item.desc) {
        if (sentence[0] === "-" || sentence[0] === "|") {
          // unordered list item or table row
          markdown.push("\n" + sentence);
        } else {
          // paragraph or another standalone element
          markdown.push("\n\n" + sentence);
        }
      }

      return markdown.join("");
    },
  },
};
</script>
