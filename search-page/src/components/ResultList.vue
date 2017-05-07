<template>
	<div>
		<ResultItem class="result-item" v-for="ref in refArr" :filters="filters" :lang="lang" :sumKey="ref" :key="ref"></ResultItem>
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
					}
				}
			}
			return tempArr;
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