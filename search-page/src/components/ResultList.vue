<template>
	<div>
		<ResultItem class="result-item" v-for="ref in refArr" :lang="lang" :sumKey="ref" :key="ref"></ResultItem>
	</div>
</template>

<script>
import Vue from 'vue'
import ResultItem from './ResultItem'
import db from '../database'

export default {
	props: ['filters','lang'],
	components: {
		ResultItem
	},
	data () {
    return {
    }
  },
	computed: {
		refArr: function(){
			var tempArr = [];
			for(var filter in this.filters){
				var refs = this.filters[filter].sumsRef;
				for(var ref in refs){
					var sumRef = refs[ref].sumRef;
					if(tempArr.indexOf(sumRef) < 0){
						tempArr.push(sumRef);
						//Vue.set(this.sumRefArr,ref,sumRef);
					}
				}
			}
			return tempArr;
		},
		results: function(){

			// sort filters in include, exclude, conditional and ignore

			// for every tag in filters
				// take the tag and get all summaries
				// check tags logic properties
					// 1 - ignore every sum in tag marked include
					// 2 - exclude every sum in tag marked exclude
					// 3 - include every sum in tag marked include

				// sort conditional further down

			// check if any sums are saved to cache
			// get list of non cached sums
			// write non saved sums to cache
			// return sumResult
			return {};
		}
	},
	methods: {
	}
}
</script>

<style scoped>
.result-item {
	margin: 30px 0 30px 0;
}
</style>