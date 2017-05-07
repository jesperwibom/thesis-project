<template>
  <div id="app">
    <div class="fixed-header">
      <InfoSection class="info-button"></InfoSection>
      <LanguageSelector class="language-selector" v-on:languageChanged="changeLanguage"></LanguageSelector>
      <SearchField class="search-field" :lang="language" :tagList="currentTagList" v-on:addTagFilter="addFilterKey"></SearchField>
      <TagFilter class="tag-filters" v-for="filter in activeFilterLabels" :tag="filter" v-on:filterLogicChanged="changeFilterLogic" v-on:filterRemoved="removeFilterKey" :key="filter"></TagFilter>
    </div>
    <ResultList :lang="language" :filters="activeFilters"></ResultList>

  </div>
</template>

<script>
import Vue from 'vue'
import TagFilter from './components/TagFilter'
import LanguageSelector from './components/LanguageSelector'
import SearchField from './components/SearchField'
import ResultList from './components/ResultList'
import InfoSection from './components/InfoSection'

import db from './database'

export default {
  name: 'app',
  components: {
    TagFilter,
    LanguageSelector,
    SearchField,
    ResultList,
    InfoSection
  },

  data () {
    return {
      language: 'SV', // current language
      activeFilterKeys: [], // filter keys
      activeFilters: {}
    }
  },

  methods: {
    changeLanguage: function(ev){
      this.language = ev;
    },
    addFilterKey: function(ev){
      this.activeFilterKeys.push(ev);
      this.addActiveFilter(ev);
    },
    removeFilterKey: function(ev) {
      var index = this.activeFilterKeys.indexOf(ev);
      this.activeFilterKeys.splice(index,1);
      this.removeActiveFilter(ev);
    },
    addActiveFilter: function(key){
      let tagVal = Object.assign({},this.completeTagList[key]);
      tagVal.logic = "include";
      tagVal.ref = key;
      Vue.set(this.activeFilters, key, tagVal);
    },
    changeFilterLogic: function(ev) {
      this.activeFilters[ev.key].logic = ev.logic;
    },
    removeActiveFilter: function(ev){
      Vue.delete(this.activeFilters, ev);
    }
  },

  computed: {
    // current tag list is in a specific language
    currentTagList: function(){
      var tempArr = [];
      for(let tag in this.completeTagList){
        let tagKey = tag;
        let tagVal = this.completeTagList[tag];
        var t = {};
        switch (this.language) {
          case 'SV':
            if(tagVal.SV && tagVal.SV.label){
              t.label = tagVal.SV.label.toLowerCase();
            } else {
              t.label = "MISSING_DATA";
            }
            break;
          case 'EN':
            if(tagVal.EN && tagVal.EN.label){
              t.label = tagVal.EN.label.toLowerCase();
            } else {
              t.label = "NO_TRANSLATION";
            }
            break;
          case 'AR':
            if(tagVal.AR && tagVal.AR.label){
              t.label = tagVal.AR.label.toLowerCase();
            } else {
              t.label = "NO_TRANSLATION";
            }
            break;
          default:
            if(tagVal.SV && tagVal.SV.label){
              t.label = tagVal.SV.label.toLowerCase();
            } else {
             t.label = "NO_TRANSLATION";
            }
            break;
        }
        t.key = tagKey;
        tempArr.push(t);
      }
      return tempArr;
    },
    // for TagFilter list
    activeFilterLabels: function(){
      var tempArr = [];
      for(var i = 0; i < this.activeFilterKeys.length; i++){

        var tagKey = this.activeFilterKeys[i];
        var tagVal = this.completeTagList[tagKey];
        var t = {};

        switch (this.language) {
          case 'SV':
            if(tagVal.SV && tagVal.SV.label){
              t.label = tagVal.SV.label.toLowerCase();
            } else {
              t.label = "MISSING_DATA";
            }
            break;
          case 'EN':
            if(tagVal.EN && tagVal.EN.label){
              t.label = tagVal.EN.label.toLowerCase();
            } else {
              t.label = "NO_TRANSLATION";
            }
            break;
          case 'AR':
            if(tagVal.AR && tagVal.AR.label){
              t.label = tagVal.AR.label.toLowerCase();
            } else {
              t.label = "NO_TRANSLATION";
            }
            break;
          default:
            if(tagVal.SV && tagVal.SV.label){
              t = tagVal.SV.label.toLowerCase();
            } else {
              t.label = "MISSING_DATA";
            }
            break;
        }
        t.key = tagKey;
        tempArr.push(t);
      }
      return tempArr;
    }
  },
  firebase: function(){
    return {
      completeTagList: {
        source: db.ref('tags'),
        asObject: true,
        cancelCallback: function () {}
      }
    }
  }
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 230px;
}
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  min-height: 120px;
  background-color: white;
  padding-top: 40px;
  padding-left: 10px;
  padding-right: 10px;
}
.info-button {
  display: inline-block;
  position: absolute;
  top: 10px;
  left: 10px;
}
.language-selector {
  margin: 10px;
}
.search-field {

}
.tag-filters {
  margin: 10px;
}
</style>
