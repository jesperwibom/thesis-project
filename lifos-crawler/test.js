const firebase = require('firebase');
const db = require('./database/index');

var text = "uppehålls tillstånd";
// var first = text.charCodeAt(0);

// console.log(String.fromCharCode(first),String.fromCharCode(first+1),String.fromCharCode(first+2),String.fromCharCode(first+3),String.fromCharCode(first+4),String.fromCharCode(first+5),String.fromCharCode(first+6),String.fromCharCode(first+7),String.fromCharCode(first+8));

db.saveTag(text,{},function(tagRef){
	console.log(tagRef);

});

/*
const config = require('../firebase.config');
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


console.log('DONE');*/