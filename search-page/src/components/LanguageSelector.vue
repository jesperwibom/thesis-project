<template>
	<div>
		<ul>
			<li v-bind:class="{ active: currentLanguage == 'SV' }" v-on:click="setLanguage" title="SV">Svenska</li>
			<li v-bind:class="{ active: currentLanguage == 'EN' }" v-on:click="setLanguage" title="EN">English</li>
			<li v-bind:class="{ active: currentLanguage == 'AR' }" v-on:click="setLanguage" title="AR">العربية</li>
		</ul>
	</div>
</template>

<script>
export default {
	data (){
		return {
			currentLanguage: 'SV'
		}
	},
	methods: {
		setLanguage (ev) {
			this.currentLanguage = ev.target.title;
			var ev = this.currentLanguage;
			this.$emit('languageChanged',ev);
		}
	}
}
</script>

<style scoped>
	div {
		display: inline-block;
	}
	ul {
		display: inline-block;
		padding-left: 0;
		margin: 0;
	}
	li {
		display: inline-block;
		padding: 1px 6px 1px 6px;
		color: black;
		background-color: #dddddd;
		border-radius: 3px;
		font-size: 16px;
		cursor: pointer;
		user-select: none;
	}
	.active {
		color: white;
		background-color: #22bbdd;
	}
</style>