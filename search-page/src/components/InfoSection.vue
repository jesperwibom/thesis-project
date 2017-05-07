<template>
	<div>
		<div id="about_button" v-on:click="toggleOverlay">
			<img src="../assets/np_info_974819_000000.svg" alt="info">
			<h4>Search (Prototype)</h4>
		</div>
		<div id="about_overlay" v-if="showAbout" v-on:click="toggleOverlay">
			<div>
				<h4>Search (Prototype)</h4>
				<p>This prototype aims to test changes and improvements to the Swedish Migration Agency's (Sv. Migrationsverket) land information database Lifos (<a href="lifos.migrationsverket.se">lifos.migrationsverket.se</a>)</p>
				<p><strong>Disclaimer:</strong> This site is part of thesis work done at Malmö University interaction design bachelor program and as such give no guarantess that the data is complete, well-formated or correctly translated.</p>
				<p>Any questions, feedback or inquiries relating to this project, contact: <a href="mailto:hello@jeppe.design">Jesper Andersson</a></p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data (){
		return {
			showAbout: false
		}
	},
	methods: {
		toggleOverlay () {
			this.showAbout = !this.showAbout;
		}
	}
}
</script>

<style scoped>
	#about_button > img {
		width: 24px;
		height: 24px;
		cursor: pointer;
	}
	#about_button > h4 {
		font-size: 22px;
		display: inline-block;
		margin: 0;
		margin-left: 10px;
		padding: 0;
		position: relative;
		top: -3px;
		cursor: pointer;
	}
	#about_overlay {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(20,20,30,0.65);
		z-index: 10;
		padding: 20px;
	}
	#about_overlay > div{
		background-color: rgb(250,250,250);
		padding: 10px;
	}
</style>