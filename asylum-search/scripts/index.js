'use strict';

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
	tagMeta: {},
	sumIndex: {},
	sumMeta: {}
};

database.ref('tag_index').once("value", function(data){
	cache.tagIndex = data.val() || {};
	// var nrInDb = Object.keys(cache.tagIndex).length;
	// console.log("number of tags in database: "+nrInDb);
});
database.ref('tag_meta').once("value", function(data){
	cache.tagMeta = data.val() || {};
	// var nrInDb = Object.keys(cache.tagMeta).length;
});
database.ref('sum_index').once("value", function(data){
	cache.sumIndex = data.val() || {};
	// var nrInDb = Object.keys(cache.sumIndex).length;
	// console.log("number of sums in database: "+nrInDb);
});
database.ref('sum_meta').once("value", function(data){
	cache.sumMeta = data.val() || {};
	// var nrInDb = Object.keys(cache.sumMeta).length;
});

function searchTag(tag){
	tag = tag.toLowerCase();
	tag = tag.replace(/\./g,"").replace(/\#/g,"").replace(/\$/g,"").replace(/\[/g,"").replace(/\]/g,"");
	if(cache.tagIndex[tag]){

		var tagMetaKey = cache.tagIndex[tag].tag_meta_ref
		//filter[tagMetaKey] = cache.tagMeta[tagMetaKey];
		Vue.set(vm.filter, tagMetaKey, cache.tagMeta[tagMetaKey])
		/*for (var key in cache.tagMeta[tagMetaKey].sum_index_refs) {
			if (cache.tagMeta[tagMetaKey].sum_index_refs.hasOwnProperty(key)) {
				var sumIndexKey = cache.tagMeta[tagMetaKey].sum_index_refs[key].sum_index_ref;
				var sumDataKey = cache.sumIndex[sumIndexKey].sum_data_ref;
				// toSessionCache(sumDataKey);
			}
		}*/
		// display of sum_data posts are taken care by vue

		return true;
	}
	return false;
}

function suggestTag(request){
	var query = request;
	query = query.toLowerCase();
	query = query.replace(/\./g,"").replace(/\#/g,"").replace(/\$/g,"").replace(/\[/g,"").replace(/\]/g,"");

	var queryRegExp = new RegExp('^'+query,'i');
	var response = Object.keys(cache.tagIndex).find(function(objKey){return queryRegExp.test(objKey)});
	var fixed = "";
	if(response != undefined){
		fixed = request + response.substring(request.split("").length);
	}

	return fixed;
};

/*function toSessionCache(sumDataKey){
	if(!vm.sumData[sumDataKey]){
		database.ref('sum_data/'+sumDataKey).once("value", function(data){
			var val = data.val() || {};
			Vue.set(vm.sumData, sumDataKey, val);
		});
	}
}*/

function storeSumData(id,key){
	// find sumDataKey

	// get data
	database.ref('sum_data/'+key).once("value", function(data){
		var val = data.val() || {};
		Vue.set(vm.sumData, id, val);
	});
}
