const firebase = require('firebase');

// Initialize Firebase
var config = {
	apiKey: "AIzaSyAUWImVcHYV043WnDkmKPAfawS260VezLA",
	authDomain: "altl-a0d6b.firebaseapp.com",
	databaseURL: "https://altl-a0d6b.firebaseio.com",
	projectId: "altl-a0d6b",
	storageBucket: "altl-a0d6b.appspot.com",
	messagingSenderId: "113484343717"
};
firebase.initializeApp(config);

var db = firebase.database();

var newTag = db.ref("tags").push();
newTag.set({
	source: "Lifos",
	SV: {
		label: "uppehålls tillstånd",
		type: "original"
	}
});

var newSum = db.ref("summaries").push();
newSum.set({
	source: {
		url: "lifos.migrationsverket.se/",
		id: "39024",
		published: "20131012"
	},
	SV: {
		title: "En titel på en dokument sammanfattning",
		description: "En kort förklaring av innehållet. Tillsammans utgör den den fullständiga Lifos texten exklusive abstrakt.",
		type: "original"
	}
});

newSum.child("tagRefs").push({
	tagRef: newTag.key
});


console.log('DONE');