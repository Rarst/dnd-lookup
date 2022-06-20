Feature("homepage");

Scenario("test homepage", ({ I }) => {
  const content = {
    abilities: "Charisma",
    classes: "Barbarian",
    conditions: "Blinded",
    "damage types": "Acid",
    equipment: "Abacus",
    features: "Ability Score Improvement",
    languages: "Abyssal",
    "magic items": "Adamantine Armor",
    "magic schools": "Abjuration",
    monsters: "Aboleth",
    proficiencies: "All armor",
    properties: "Ammunition",
    races: "Dragonborn",
    skills: "Acrobatics",
    spells: "Acid Arrow",
    subclasses: "Berserker Barbarian",
    subraces: "High Elf",
    traits: "Artificer's Lore",
  };

  I.amOnPage("/");

  for (let [link, header] of Object.entries(content)) {
    I.pressKey("Escape");
    I.click(link);
    I.see(header);
    I.dontSee("undefined");
  }
});
