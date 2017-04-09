'use strict';

const firebase = require("firebase");
// const colors	= require('colors/safe');
// const radio    = require("radio");

const config = require('../firebase.config');
firebase.initializeApp(config);
const database = firebase.database();

// creating empty cache object
var cache = {
	tags: {},
	summaries: {},
	documents: {},
	sumIDs: {}
};

var initalRead = {
	tags: false,
	summaries: false,
	documents: false
};

module.exports.setCacheListeners = function(startUrl,callback){
	console.log('setting database listeners...');
	// storing existing tags, summaries and documents to local temporary cache
	database.ref('tags').once('value',function(data){
		cache.tags = data.val() || {};
		initalRead.tags = true;
		// setting listeners for new tags
		database.ref('tags').limitToLast(1).on('child_added',function(data){
			cache.tags[data.key] = data.val();
		});
		// calling callback method if all inital read props are true
		if(initalRead.tags && initalRead.summaries && initalRead.documents){
			console.log('all database listeners are set');
			callback(startUrl);
		}
	});
	database.ref('summaries').once('value',function(data){
		cache.summaries = data.val() || {};
		initalRead.summaries = true;
		// setting special cache for crawler fetch conditions
		for(var sum in cache.summaries){
			var _id = cache.summaries[sum].source.id;
			var _url = cache.summaries[sum].source.url;
			cache.sumIDs[_id] = _url;
		}
		// setting listeners for new summaries
		database.ref('summaries').limitToLast(1).on('child_added',function(data){
			var sumObj = data.val();
			cache.summaries[data.key] = sumObj;
			cache.sumIDs[sumObj.source.id] = sumObj.source.url;
		});
		// calling callback method if all inital read props are true
		if(initalRead.tags && initalRead.summaries && initalRead.documents){
			console.log('all database listeners are set');
			callback(startUrl);
		}
	});
	database.ref('documents').once('value',function(data){
		cache.documents = data.val() || {};
		initalRead.documents = true;
		// setting listeners for new documents
		database.ref('documents').limitToLast(1).on('child_added',function(data){
			cache.documents[data.key] = data.val();
		});
		// calling callback method if all inital read props are true
		if(initalRead.tags && initalRead.summaries && initalRead.documents){
			console.log('all database listeners are set');
			callback(startUrl);
		}
	});
};

module.exports.getCache = function(type){
	switch (type) {
		case "tags":
			return cache.tags;
		case "summaries":
			return cache.summaries;
		case "documents":
			return cache.documents;
		case "sumIDs":
			return cache.sumIDs;
		default:
			return cache;
	}
};

// save summary and iterate tags and documents and save those
module.exports.saveSummary = function(summary,tags,documents){
	// because fetch conditions are set to ignore summaries already in database
	// there is no need to check if the summary already exists
	var sumRef = database.ref('summaries').push();
	sumRef.set({
		source: {
			url: summary.url,
			id: summary.id,
			published: summary.published,
			publisher: summary.publisher
		},
		SV: {
			title: summary.title,
			description: summary.description,
			type: "original"
		}
	});

	for(var i = 0; i < tags.length; i++){
		saveTag(tags[i],sumRef,function(_tagRef,_sumRef){
			connectTagRefs(_tagRef,_sumRef);
		});
	}
	for(var i = 0; i < documents.length; i++){
		console.log(documents[i]);
		saveDocument(documents[i],sumRef,function(_docRef,_sumRef){
			connectDocRefs(_docRef,_sumRef);
		});
	}

};

// if tag don't exist in database save tag to database
function saveTag(tag,sumRef,callback){
	// using firebase filtering functionality to streamline request
	// sort on the original labels, starting from the first character ending the query at the next character in the alphabet (or in unicode)
	database.ref('tags').orderByChild('SV/label').startAt(tag.charAt(0)).endAt(String.fromCharCode(tag.charCodeAt(0)+1)).once("value", function(data){
		let tagRef;
		// iterate over the found tags
		for(let t in data.val()){
			if(data.val()[t].SV.label == tag){
				tagRef = database.ref('tags/'+t);
				callback(tagRef,sumRef);
				return false;
			}
		}
		tagRef = database.ref('tags').push();
		tagRef.set({
			source: "Lifos",
			SV: {
				label: tag,
				type: "original"
			}
		});
		callback(tagRef,sumRef);
		return true;
	});
};

function saveDocument(document,sumRef,callback){
	let docRef;
	docRef = database.ref('documents').push();
	docRef.set({
		source: {
			url: document.url,
			label: document.label,
			type: document.type
		}
	});
	console.log('new document added!')
	callback(docRef,sumRef);
	return true;
};

// connect the summary and tag references so that they know of each other
function connectTagRefs(_tagRef,_sumRef){
	// set the tag entry reference key in the summary
	_sumRef.child('tagsRef').push({
		tagRef: _tagRef.key
	});
	// set the summary entry reference key in the tag
	_tagRef.child('sumsRef').push({
		sumRef: _sumRef.key
	});
}

function connectDocRefs(_docRef,_sumRef){
	// set the tag entry reference key in the summary
	_sumRef.child('docsRef').push({
		docRef: _docRef.key
	});
	// set the summary entry reference key in the tag
	_docRef.child('sumsRef').push({
		sumRef: _sumRef.key
	});
}


// NOT USED ANYMORE, just use pushId as keys
// replace characters that firebase cannot use in key
function fixTag(tag){
	return tag = tag.replace(/\./g,"").replace(/\#/g,"").replace(/\$/g,"").replace(/\[/g,"").replace(/\]/g,"");
};