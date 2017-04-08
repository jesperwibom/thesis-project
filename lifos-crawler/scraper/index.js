'use strict';

const cheerio = require('cheerio');
const colors	= require('colors/safe');
const translator = require('../translator/index');
const database = require("../database/index");
const session  = require("../session/index");

module.exports.extractData = function(html,url) {

	var $ = cheerio.load(html);
	var tags = [];
	var sum = {};
	var docs = [];

	// gets summary data and document references
	// if page is not a summary page it returns false
	if ($('#documentViewerContainer').length){
		sum = extractSumData($, '#documentViewerContainer'); // return obj of sum data
		docs = extractDocs($,'.documentViewerTextDistance'); // return arr of docs meta
		console.log(colors.black.bgGreen.bold("Fetch complete:")+" "+colors.yellow.dim.bold(url.subString(32)));
	} else {
		console.log(colors.black.bgGreen.bold("Fetch complete:")+" "+colors.red.dim("not a document summary page"));
		return false;
	}

	// gets summary meta and tags
	// if no meta data is found it returns false
	if($('#metadataDisplayMain').length){
		sum = Object.assign(sum, extractSumMeta($, '#metadataDisplayInformation')); // return obj of sum meta and add it to the sum obj
		tags = extractTags($, '#metadataDisplayMain'); // return arr of tags
	} else {
		console.log(colors.red.bold("no meta data found"));
		return false;
	}
	sum.url = url;

	console.log(colors.bold("%s"), sum.title);
	console.log(colors.dim("%s"), sum.abstract);

	translator.translateSum(sum,tags,docs,function(sum, trans,tags,docs){
		database.saveSum(sum,trans,tags,docs);
		session.addSumsWritten(1);
	});

	for(var i = 0; i < tags.length; i++){
		var tag = tags[i];
		tag = tag.replace(/\./g,"").replace(/\#/g,"").replace(/\$/g,"").replace(/\[/g,"").replace(/\]/g,"");
		if(database.getCache("tagIndex")[tag]){
			//console.log(colors.green.bold("TAG ALREADY EXISTS : ")+tag);
			session.addTagsSkipped(1);
			database.saveTagSumReference(tag,sum.id,sum.url);
			continue;
		}
		console.log(colors.red.dim("ADDING TAG : ")+tag);

		translator.translateTag(tag,sum.id,sum.url,function(tag,trans,sumId,sumUrl){
			database.saveTag(tag,trans,sumId,sumUrl);
			session.addTagsWritten(1);
		});
	}
};

function extractTags($, queryString){
	var tempArr = [];
	$(queryString).filter(function(){
		let data = $(this);
		tempArr = data.find('#metadataDisplaySubjectword').text().toLowerCase().split(", ");
		//console.log("tags found: "+data.find('#metadataDisplaySubjectword').text())
	});
	return tempArr;
}

function extractSumData($, queryString){
	var tempObj = {};
	$(queryString).filter(function(){
		let data = $(this);
		tempObj.title = data.find(".DocumentHeader").text();
		tempObj.abstract = data.find("#documentViewerSummary").children().eq(1).text().trim();
		tempObj.summary = data.find("#documentViewerSummary").text().trim();
		if(tempObj.abstract == "" || tempObj.abstract == undefined || tempObj.abstract == null){
			tempObj.abstract = data.find("#documentViewerSummary").text().trim();
		}
		if(tempObj.abstract === "---" || tempObj.abstract === "- - -" ||tempObj.abstract === ""){
			tempObj.abstract = "NO_DESCRIPTION";
		}
	});
	return tempObj;
}

function extractSumMeta($, queryString){
	var tempObj = {};
	$(queryString).filter(function(){
		let data = $(this);
		tempObj.source = data.find(".metadataDisplayRightColumn").eq(0).text().trim();
		tempObj.date = data.find(".metadataDisplayRightColumn").eq(1).text().trim();
		tempObj.id = data.find(".metadataDisplayRightColumn").eq(2).text().trim();
	});
	return tempObj;
}

function extractDocs($, queryString){
	var tempArr = [];
	$(queryString).filter(function(){
		let data = $(this);
		data.each(function(index, el){
			if($(el).text().match(/[0-9]+\.(pdf)/i)){
				tempArr.push({
					id: $(el).text().trim().replace(".pdf",""),
					url: "http://lifos.migrationsverket.se"+$(el).children('a').eq(0).attr('href')
				});
			} else {
				tempArr.push({
					id: "EXTERNAL_LINK",
					url: $(el).text()
				});
			}
		});
	});
	return tempArr;
}