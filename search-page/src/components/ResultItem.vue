<template>
	<div>
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
	props: ["lang","sumKey"],
	data () {
		return {
			sum: {}
		}
	},
	computed: {
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
</style>