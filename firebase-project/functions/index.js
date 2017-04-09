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

	if(ogDescription === 'No description found'){
		translateClient.translate(ogTitle, 'en')
			.then((results) => {
				const transTitle = results[0];
				sumRef.child('EN').update({
					title: transTitle,
					description: 'No description found'
				});
		});
		translateClient.translate(ogTitle, 'ar')
			.then((results) => {
				const transTitle = results[0];
				sumRef.child('AR').update({
					title: transTitle,
					description: 'تعذر العثور على الوصف'
				});
		});
	} else {
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
	}

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
/*
exports.countTags = functions.database.ref('/tags/{pushId}').onWrite(event => {
	const tagsRef = event.data.ref.parent;
	const metaRef = tagsRef.parent.child("meta/tagCount");

	return metaRef.transaction(current => {
		if (event.data.exists() && !event.data.previous.exists()) {
			return (current || 0) + 1;
		} else if (!event.data.exists() && event.data.previous.exists()) {
			return (current || 0) - 1;
		}
	});
});*/

exports.recountTags = functions.database.ref('/meta/tagCount').onWrite(event => {
	if (!event.data.exists()) {
		const countRef = event.data.ref;
		const metaRef = event.data.ref.parent;
		const tagRef = metaRef.parent.child('tags');

		return tagRef.once('value')
		  .then(snapshot => countRef.set(snapshot.numChildren()));
	}
});
/*
exports.countSummaries = functions.database.ref('/summaries/{pushId}').onWrite(event => {
	const sumRef = event.data.ref.parent;
	const metaRef = sumRef.parent.child("meta/summaryCount");

	return metaRef.transaction(current => {
		if (event.data.exists() && !event.data.previous.exists()) {
			return (current || 0) + 1;
		} else if (!event.data.exists() && event.data.previous.exists()) {
			return (current || 0) - 1;
		}
	});
});
*/
exports.recountSummaries = functions.database.ref('/meta/summaryCount').onWrite(event => {
	if (!event.data.exists()) {
		const countRef = event.data.ref;
		const metaRef = event.data.ref.parent;
		const sumRef = metaRef.parent.child('summaries');

		return sumRef.once('value')
		  .then(snapshot => countRef.set(snapshot.numChildren()));
	}
});

/*
exports.countDocuments = functions.database.ref('/documents/{pushId}').onWrite(event => {
	const docRef = event.data.ref.parent;
	const metaRef = docRef.parent.child("meta/documentCount");

	return metaRef.transaction(current => {
		if (event.data.exists() && !event.data.previous.exists()) {
			return (current || 0) + 1;
		} else if (!event.data.exists() && event.data.previous.exists()) {
			return (current || 0) - 1;
		}
	});
});
*/
exports.recountDocuments = functions.database.ref('/meta/documentCount').onWrite(event => {
	if (!event.data.exists()) {
		const countRef = event.data.ref;
		const metaRef = event.data.ref.parent;
		const docRef = metaRef.parent.child('documents');

		return docRef.once('value')
		  .then(snapshot => countRef.set(snapshot.numChildren()));
	}
});