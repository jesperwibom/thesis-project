'use strict';

const cheerio = require('cheerio');
const colors	= require('colors/safe');
const translator = require('../translator/index');
const database = require("../dbUtil/index");

module.exports.extractData = function(html,url) {

	var $ = cheerio.load(html);
	var tags = [];
	var sum = {};
	var docs = {};

	if ($('#documentViewerContainer').length){
		sum = extractSumData($, '#documentViewerContainer');
	} else {
		console.log(colors.red.bold("not a document summary page\n"));
		return false;
	}
	if($('#metadataDisplayMain').length){
		sum = Object.assign(sum, extractSumMeta($, '#metadataDisplayInformation'));
		tags = extractTags($, '#metadataDisplayMain');
	} else {
		console.log(colors.red.bold("no meta data found\n"));
		return false;
	}
	sum.url = url;

	console.log(colors.blue.bold("document data"));
	console.log(colors.bold("%s"), sum.title);
	console.log(colors.dim("%s"), sum.abstract);

	translator.translateSum(sum,tags,function(sum, trans,tags){
		database.saveSum(sum,trans,tags);
	});

	for(var i = 0; i < tags.length; i++){
		var tag = tags[i];
		if(database.getCache("tagIndex")[tag]){
			continue;
		}
		translator.translateTag(tag,sum.id,sum.url,function(tag,trans,sumId,sumUrl){
			database.saveTag(tag,trans,sumId,sumUrl);
		});
	}
};


function extractTags($, queryString){
	var tempArr = [];
	$(queryString).filter(function(){
		let data = $(this);
		tempArr = data.find('#metadataDisplaySubjectword').text().toLowerCase().split(", ");
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