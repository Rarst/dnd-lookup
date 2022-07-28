import types from "./types.js";

const rawData = {};
const version = "1.3.0";

export default {
  fetchAll(typeLoadedCallback) {
    return Promise.all(
      Object.keys(types).map((type) => this.fetch(type, typeLoadedCallback))
    );
  },

  fetch(type, typeLoadedCallback) {
    // Errors in SSG.
    if (typeof window.fetch === "undefined") {
      return;
    }

    return window
      .fetch(
        `https://cdn.jsdelivr.net/gh/bagelbits/5e-database@${version}/src/5e-SRD-${types[type].file}.json`
      )
      .then((response) => response.json())
      .then((data) => {
        if (type === "abilities") {
          data = data.map((item) => {
            item.short_name = item.name;
            item.name = item.full_name;
            return item;
          });
        } else if (type === "features") {
          // data = data.filter(item => !item.name.includes('Spellcasting: '))
        } else if (type === "proficiencies") {
          data = data.filter(
            (item) => item.classes.length || item.races.length
          );
        }
        rawData[type] = data.map((item) => {
          item.search_type = type;
          item.key = `${type}-${item.index}`;
          return item;
        });

        typeLoadedCallback(type);
      });
  },

  query(query) {
    if (!query) {
      return [];
    }

    query = query.toLowerCase();

    return Object.keys(types)
      .map((type) => this.filter(type, query))
      .flat()
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  filter(type, query) {
    if (type === query) {
      return rawData[type];
    }

    let filtered = [];
    let duplicates = false;

    if (type === "equipment" || type === "magic items") {
      filtered = filtered.concat(
        rawData[type].filter(
          (item) => item.equipment_category.name.toLowerCase() === query
        )
      );
      duplicates = true;
    }

    filtered = filtered.concat(
      rawData[type].filter((item) => item.name.toLowerCase().includes(query))
    );

    filtered = duplicates ? Array.from(new Set(filtered)) : filtered;

    return filtered;
  },
};
