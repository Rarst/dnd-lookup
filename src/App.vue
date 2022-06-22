<template>
  <div>
    <SearchInput
      v-model="search"
      ref="input"
      :loading="loading"
      @clear="reset(true)"
    ></SearchInput>

    <div
      v-show="!results.length"
      class="mt-3 flex flex-wrap justify-center px-6"
    >
      <TypeLink v-for="type in types" :type="type" :key="type"></TypeLink>
    </div>

    <div v-show="results.length" class="mt-6 space-y-6">
      <SearchResult
        v-for="item in results"
        :item="item"
        :key="item.key"
      ></SearchResult>
    </div>
  </div>
</template>

<script>
import data from "./srdData.js";

import SearchInput from "./components/SearchInput.vue";
import SearchResult from "./components/SearchResult.vue";
import TypeLink from "./components/TypeLink.vue";

const showSize = 20;

export default {
  components: { SearchInput, SearchResult, TypeLink },

  data() {
    return {
      loading: true,
      search: "",
      types: [],
      results: [],
      more: [],
    };
  },

  created() {
    this.init();

    window.addEventListener("popstate", this.navigate);
    window.addEventListener(
      "keyup",
      (e) => e.key === "Escape" && this.reset(true)
    );
    window.addEventListener("scroll", this.handleScroll, { passive: true });
  },

  watch: {
    search: function (query) {
      this.runSearch(query);
    },
  },

  methods: {
    init() {
      data
        .fetchAll((type) => this.types.push(type))
        .then(() => {
          this.navigate();
          this.types.sort();
          this.loading = false;
          this.$nextTick(() => this.focus());
        });
    },

    handleScroll() {
      if (
        this.more.length &&
        document.documentElement.scrollHeight -
          (window.scrollY + window.innerHeight) <
          100
      ) {
        this.loadMore();
      }
    },

    runSearch(query) {
      query = query.replace(/%20/g, " ");
      window.scroll(0, 0);

      if (!query || query.length < 3) {
        this.reset(!query);
        return;
      }

      window.location.hash = query;
      const results = data.query(query);
      this.results = results.splice(0, showSize);
      this.more = results;
    },

    navigate() {
      this.search = window.location.hash.substring(1).replace(/%20/g, " ");
    },

    loadMore() {
      this.results.push(...this.more.splice(0, showSize));
    },

    reset(resetInput = false) {
      this.results = [];
      this.more = [];

      if (resetInput) {
        window.location.hash = "";
        this.search = "";
        this.focus();
      }
    },

    focus() {
      this.$refs.input.focus();
    },
  },
};
</script>
