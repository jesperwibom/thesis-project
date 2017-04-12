<template>
	<div v-bind:class="filterLogic" v-on:click="toggleFilterLogic">
		<span class="search-filter-label">{{tag.label}}</span>
		<span v-on:click="removeFilter"> X</span>
	</div>
</template>

<script>
export default {
	props: ['tag'],
	data () {
		return {
			filterLogic: "include" //can be 'include', 'conditional', 'exclude' or 'ignore'
		}
	},
	methods: {
		toggleFilterLogic (ev) {
			if(this.filterLogic === "include"){
				this.filterLogic = "conditional"
			} else if(this.filterLogic === "conditional"){
				this.filterLogic = "exclude"
			} else if(this.filterLogic === "exclude"){
				this.filterLogic = "ignore"
			} else if(this.filterLogic === "ignore"){
				this.filterLogic = "include"
			}
			var ev = {
				key: this.tag.key,
				logic: this.filterLogic
			};
			this.$emit('filterLogicChanged',ev);
		},
		removeFilter (ev) {
			this.$emit('filterRemoved',this.tag.key);
		}
	}
}
</script>

<style scoped>
	div {
		font-size: 20px;
		display: inline-block;
		padding: 2px 12px 2px 12px;
		border-radius: 5px;
		color: white;
		cursor: pointer;
		user-select: none;
		background-color: #373737;
	}
	/*.include {
		background-color: #5AA845;
	}
	.include:hover {
		background-color: #4A8A39;
	}
	.conditional {
		background-color: #CDA537;
	}
	.conditional:hover {
		background-color: #C99D24;
	}
	.exclude {
		background-color: #BA3441;
	}
	.exclude:hover {
		background-color: #AA303C;
	}
	.ignore {
		background-color: #AEB7B1;
	}
	.ignore:hover {
		background-color: #A5ACA8;
	}*/
</style>