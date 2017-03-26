'use strict';

const firebase = require("firebase");
const colors	= require('colors/safe');

var config = {
	apiKey: "AIzaSyD93bqwNxuyflXc0AFAGhx6QdaFJQQ8yZQ",
	authDomain: "lifosalternativesearch.firebaseapp.com",
	databaseURL: "https://lifosalternativesearch.firebaseio.com",
	storageBucket: "lifosalternativesearch.appspot.com",
	messagingSenderId: "658803108313"
};

firebase.initializeApp(config);
const database = firebase.database();

var cache = {
	tagIndex: {},
	sumIndex: {},
	docIndex: {}
};

firebase.database().ref('tag_index').on('child_added',function(data){
	cache.tagIndex[data.key] = data.val();
});
firebase.database().ref('sum_index').on('child_added',function(data){
	cache.sumIndex[data.key] = data.val();
});
firebase.database().ref('doc_index').on('child_added',function(data){
	cache.docIndex[data.key] = data.val();
});

module.exports.getCache = function(type){
	switch (type) {
		case "tagIndex":
			return cache.tagIndex;
		case "sumIndex":
			return cache.sumIndex;
		case "docIndex":
			return cache.docIndex;
		default:
			return cache;
	}
};

module.exports.saveTag = function(tag, trans, sumId, sumUrl){

	trans = trans || "NOT_TRANSLATED";

	if(!cache.tagIndex[tag]){
		console.log(colors.red.bold("ADDING TAG : ")+tag);
		var tagDataRef = firebase.database().ref('tag_data').push();
		tagDataRef.set({
			sv:{
				label: tag
			},
			en: {
				label: trans
			}
		});

		var tagMetaRef = firebase.database().ref('tag_meta').push();
		tagMetaRef.update({
			label: tag
		});
		var sumReferenceDataRef = tagMetaRef.child('sum_index_refs').push();
		sumReferenceDataRef.update({
			sum_index_ref: sumId,
			sum_url: sumUrl
		});

		var tagIndexRef = firebase.database().ref('tag_index/'+tag).set({
			added: firebase.database.ServerValue.TIMESTAMP,
			language_sv: {
				sv: true
			},
			tag_meta_ref: tagMetaRef.key,
			tag_data_ref: tagDataRef.key
		});

		if(trans !== "NOT_TRANSLATED"){
			var tagIndexTransRef = firebase.database().ref('tag_index/'+trans).update({
				added: firebase.database.ServerValue.TIMESTAMP,
				tag_meta_ref: tagMetaRef.key,
				tag_data_ref: tagDataRef.key
			},function(){
				firebase.database().ref('tag_index/'+trans+'/language_en').update({en: true});
			});
		}
	} else {
		console.log(colors.green.bold("TAG ALREADY EXISTS : ")+tag);
		var sumReferenceDataRef = tagMetaRef.child('sum_index_refs').push();
		sumReferenceDataRef.update({
			sum_index_ref: sumId,
			sum_url: sumUrl
		});
	}
};

module.exports.saveSum = function(sum, trans, tags){

	if(!cache.sumIndex[sum.id]){
		console.log(colors.yellow.bold("ADDING SUM : ")+sum.id);
		var sumDataRef = firebase.database().ref('sum_data').push();
		sumDataRef.set({
			sv:{
				title: sum.title,
				abstract: sum.abstract,
				summary: sum.summary
			},
			en: {
				title: trans.title,
				abstract: trans.abstract,
				summary: trans.summary
			}
		});

		var sumMetaRef = firebase.database().ref('sum_meta').push();
		sumMetaRef.update({
			url: sum.url,
			publish_id: sum.id,
			publish_date: sum.date,
			source: sum.source
		});

		/*
		//for each document a new reference needs to be pushed
		for(var i = 0; i < docs.length; i++){
			var docReferenceDataRef = sumMetaRef.child('doc_index_refs').push();
			docReferenceDataRef.update({
				doc_index_ref: "EMPTY",
				doc_url: "EMPTY",
				external: "true | false",
				type: "MAIN | AUX"
			});
		}
		*/

		//for each tag a new reference needs to be pushed
		for(var i = 0; i < tags.length; i++){
			var tagReferenceDataRef = sumMetaRef.child('tag_index_refs').push();
			tagReferenceDataRef.update({
				tag_index_ref: tags[i]
			});
		}

		var sumIndexRef = firebase.database().ref('sum_index/'+sum.id).set({
			added: firebase.database.ServerValue.TIMESTAMP,
			sum_meta_ref: sumMetaRef.key,
			sum_data_ref: sumDataRef.key
		});

	} else {
		console.log(colors.blue.bold("SUM ALREADY EXISTS : ")+sum.id);
	}
};

/*
//for every document found
var documentRef = firebase.database().ref('documents').push({
	meta:{
		type: "LIFOS_DOC",
		author: "john doe",
		url: "http://lifos.migrationsverket.se/document?download=12345",
		date: "20160401",
		no_pages: "3"
	},
	data:{
		sv: {
			title: "Rättsligt ställningstagande till ...."
			//after this push every page in here
		}
	}
}, function(){
	//for every page in every document
	for(var i = 0; i < 3; i++){
		firebase.database().ref('documents/'+documentRef.key+'/data/sv/pages').push({
			page_nr: i+1,
			text: "this is the text on a page, parsed by a document reader"
		});
	}
});
*/