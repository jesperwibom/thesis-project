<template>
	<div v-if="filtered" v-bind:class="alignmentClass">
		<h4>{{sumData.title}}</h4>
		<h5 v-if="sumData.source != undefined"><span class="light">source:</span> {{sumData.source.publisher}}</h5>
		<h5 v-if="sumData.source != undefined"><span class="light">date:</span> {{sumData.source.published}}</h5>
		<p>{{sumData.description}}</p>
		<h5 v-if="sumData.source != undefined"><a v-bind:href="sumData.source.url"><span class="light">Lifos entry:</span> {{sumData.source.id}}</a></h5>
	</div>
</template>

<script>
import Vue from 'vue'
import db from '../database'

export default {
	props: ["lang","sumKey","filters"],
	data () {
		return {
			sum: {}
		}
	},
	computed: {
		alignmentClass: function(){
			if(this.lang == "AR"){
				return "align-right";
			} else {
				return "align-left";
			}
		},
		sumData () {
			var tempObj = {};
			switch (this.lang) {
				case 'SV':
					tempObj = Object.assign({},this.sum.SV);
					break;
				case 'EN':
					tempObj = Object.assign({},this.sum.EN);
					break;
				case 'AR':
					tempObj = Object.assign({},this.sum.AR);
					break;
				default:
					tempObj = Object.assign({},this.sum.SV);
					break;
        	}
			tempObj.source = this.sum.source;
			return tempObj;
		},
		filtered () {
			var show = true;
			for(var filter in this.filters){
				var filterCheck = false;
				var refs = this.filters[filter].sumsRef;
				for(var ref in refs){
					var sumRef = refs[ref].sumRef;
					if(sumRef == this.sumKey){
						filterCheck = true;
					}
				}
				if(!filterCheck){
					show = false;
					break;
				}
			}
			return show;

			/*
			// setup filters by logic
			var includes = [];
			var excludes = [];
			var conditionals = [];
			for(var filter in this.filters){
				var logic = this.filters[filter].logic;
				console.log(logic);
				switch (logic) {
					case "inlcude":
						break;
					case "exclude":
						break;
					case "conditional":
						break;
					default:
						break;
				}
			}*/


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
		}
	},
	mounted: function () {
   	this.$bindAsObject('sum', db.ref('summaries').child(this.sumKey));
  	}
}
</script>

<style scoped>
div {
	text-align: left;
}
h4{
	margin: 0;
}
h5 {
	margin: 0;
}
p {
	margin: 0;
}
.light {
	font-weight: 400;
}

.align-left {
	text-align: left;
}
.align-right {
	text-align: right;
}
</style>