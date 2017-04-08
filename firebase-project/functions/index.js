const functions 	= require('firebase-functions');
const admin 		= require('firebase-admin');
const Translate 	= require('@google-cloud/translate');

// Your Google Cloud Platform project ID
const projectId = 'altl-a0d6b';
// Instantiates a client
const translateClient = Translate({
  projectId: projectId
});
// Configure Firebase functions
admin.initializeApp(functions.config().firebase);

// When a new tag is created it is automatically translated by Firebase cloud functions
exports.translateTag = functions.database.ref('/tags/{pushId}/SV').onWrite(event => {
	const tagRef = event.data.ref.parent;
	let label = event.data.val().label;

	translateClient.translate(label, {from: 'sv',to:'en'})
		.then((results) => {
			const translation = results[0];
			tagRef.child('EN').update({
				label: translation
			});
			console.log(`Tag: ${label}`);
			console.log(`Translation: ${translation}`);
	});
	translateClient.translate(label, {from: 'sv',to:'ar'})
		.then((results) => {
			const translation = results[0];
			tagRef.child('AR').update({
				label: translation
			});
			console.log(`Tag: ${label}`);
			console.log(`Translation: ${translation}`);
	});

	return tagRef.update({
		EN: {
			label: "NEED_TRANSLATION",
			type: "translation"
		},
		AR: {
			label: "NEED_TRANSLATION",
			type: "translation"
		}
	});
});



exports.translateSum = functions.database.ref('/summaries/{pushId}/SV').onWrite(event => {
	const sumRef = event.data.ref.parent;

	let ogTitle = event.data.val().title;
	let ogDescription = event.data.val().description;

	translateClient.translate([ogTitle,ogDescription], 'en')
		.then((results) => {
			const transTitle = results[0][0];
			const transDescription = results[0][1];
			sumRef.child('EN').update({
				title: transTitle,
				description: transDescription
			});
	});
	translateClient.translate([ogTitle,ogDescription], 'ar')
		.then((results) => {
			const transTitle = results[0][0];
			const transDescription = results[0][1];
			sumRef.child('AR').update({
				title: transTitle,
				description: transDescription
			});
	});

	return sumRef.update({
		EN: {
			title: "NEED_TRANSLATION",
			description: "NEED_TRANSLATION",
			type: "translation"
		},
		AR: {
			title: "NEED_TRANSLATION",
			description: "NEED_TRANSLATION",
			type: "translation"
		}
	});
});