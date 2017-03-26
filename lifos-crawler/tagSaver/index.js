'use strict';

const colors	= require('colors/safe');
const translate= require('google-translate-api');
const database = require("../dbUtil/index.js");

var sessionData = {
	testedTags: 0,
	addedTags: 0
};

var tagsCache = [];

// take an array of keywords/phrases (eg from a Lifos document summary)
// !!! an optional langauge code can be used to narrow search (default is "sv" swedish) NOT IMPLEMENTED
// then iterate through every index of the provided array
// and checks for existing tags[i].data.title
// !!! or tags[i].data.alias[j] NOT IMPLEMENTED
// if no existing tag could be found a new tag object will be created
// the new tag object will then be pushed to tagsCache (after translateTag())
module.exports.parse = function(tags, src, lang) {
	var source = src || "lifos";
	var language = lang || "sv";

	//var updated = false;
	console.log("\n"+colors.bold(tagsCache.length)+" tags already in tagsCache\n");

	//database.saveTags(tags);

	for(var i = 0; i < tags.length; i++){

		sessionData.testedTags++;

		var tag = tags[i].toLowerCase();
		var id = tag.replace(/ /g, "-")+"_"+language+"_"+source;
		var exists = false;

		for(var j = 0; j < tagsCache.length; j++){
			if(tag == tagsCache[j].data.sv.title){
				exists = true;
			}
		}

		if(exists){
			console.log(colors.yellow.bold(tag)+colors.green(" ALREADY EXISTS"));
		}

		if(!exists){
			console.log(colors.yellow.bold(tag)+colors.red(" NOT FOUND ")+colors.dim("pushing tag to tagsCache"));
			// console.log("tagsCache[newIndex-1].data.sv.title : "+tagsCache[newIndex-1].data.sv.title+" : "+ typeof tagsCache[newIndex-1].data.sv.title);

			var temp = {
				id: id,
				source: {
					db: source,
					language: language
				},
				data: {
					sv: {
						title: tag,
						alias: [tag]
					},
					en: {
						title: "",
						alias: []
					}
				}
			};
			var newTagIndex = writeTag(temp);
			translateTag(tag,newTagIndex);

			//translator.translateTag(tagsCache[newIndex-1].data.sv.title, {to: 'en'});

		}
	}

	// if(updated){
	// 	console.log("\nUPDATE:"+"\n"+colors.bold(tagsCache.length)+" tags in localStorage");
	// }
};


module.exports.setCache = function(cache){
	tagsCache = JSON.parse(cache);
};

//overwrites the existing tags.master.json
module.exports.getCache = function() {
	return JSON.stringify(tagsCache,null,"  ");
};

module.exports.getSessionData = function(){
	return sessionData;
};

function writeTag(tempObj){
	var newTagIndex = tagsCache.push(tempObj);
	sessionData.addedTags++;
	console.log("wrote tag "+ tempObj.data.sv.title +" to cache")
	return newTagIndex-1;
};

function writeTranslationToIndex(index, trans){
	console.log("Pushing translation "+trans+" to cahche index "+index);
	tagsCache[index].data.en.title = trans;
	tagsCache[index].data.en.alias = [trans];
}

function translateTag(tagStr,cacheIndex){
	console.log("translating tag "+tagStr);
	translate(tagStr, {to: 'en'})
		.then(res => {
			console.log(tagStr+" SV => EN: "+res.text.toLowerCase());
			writeTranslationToIndex(cacheIndex, res.text.toLowerCase());
		}).catch(err => {
			console.log(tagStr+" COULD NOT FIND TRANSLATION ", err);
	});
}
