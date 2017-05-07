<template>
	<div>
		<input v-bind:class="alignmentClass" type="text" v-model="suggestion" disabled="disabled"/>
		<input v-bind:class="alignmentClass" type="text" v-model="search" v-on:keyup.13="addTagFilter" v-bind:placeholder="searchPlaceholderText" />
	</div>
</template>

<script>
export default {
	props: ["tagList","lang"],
	data () {
		return {
			search: "",
			suggestionObj: {}
		}
	},
	methods: {
		addTagFilter: function(ev){
			if(this.search !== ""){
				this.$emit('addTagFilter',this.suggestionObj.key);
				this.search = "";
			}
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
		suggestion: function(){
			if(this.search != ""){
				var query = this.search;
				query = query.toLowerCase();
				var queryRegExp = new RegExp('^'+query,'i');
				var match = this.tagList.find(function(element, index, array){
					return queryRegExp.test(element.label);
				});
				var fixed = "";
				if(match != undefined){
					this.suggestionObj = match;
					fixed = this.search + match.label.substring(this.search.split("").length);
				}
				return fixed;
			} else {
				return "";
			}
		},
		searchPlaceholderText: function(){
	      switch (this.lang) {
	        case 'SV':
	          return "sök här...";
	        case 'EN':
	          return "search here...";
	        case 'AR':
	          return "ابحث هنا";
	        default:
	          return "sök här...";
	      }
    	},
	}
}
</script>

<style scoped>
div {
	margin-left: auto;
	margin-right: auto;
	position: relative;
	display: block;
	min-height: 50px;
	min-width: 220px;
	max-width: 440px;
	margin-top: 0;
	margin-bottom: 0;
}
input {
	font-size: 28px;
	position: absolute;
	background: none;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	width: 100%;
	display: inline-block;
	border: 3px solid grey;
	padding: 5px 10px 4px 10px;
	box-sizing: border-box;
	border-radius: 4px;
}

input:focus{
	border: 3px solid black;
}
input:focus::-webkit-input-placeholder { color:transparent; }
input:focus:-moz-placeholder { color:transparent; } /* FF 4-18 */
input:focus::-moz-placeholder { color:transparent; } /* FF 19+ */
input:focus:-ms-input-placeholder { color:transparent; } /* IE 10+ */

.align-left {
	text-align: left;
}
.align-right {
	text-align: right;
}

</style>