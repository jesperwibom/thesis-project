'use strict';

const cheerio = require('cheerio');
const colors	= require('colors/safe');
const database = require("../database/index");

module.exports.extractData = function(html,url) {

	var $ = cheerio.load(html);
	var tags = [];
	var summary = {};
	var documents = [];

	// gets summary data and document references
	// if page is not a summary page it returns false
	if ($('#documentViewerContainer').length){
		summary = extractSumData($, '#documentViewerContainer'); // return obj of sum data
		documents = extractDocs($,'.documentViewerTextDistance'); // return arr of docs meta

	} else {
		console.log(colors.red.dim("not a document summary page"));
		return false;
	}

	// gets summary meta and tags
	// if no meta data is found it returns false
	if($('#metadataDisplayMain').length){
		// return object of summary meta and add it to the summary object
		summary = Object.assign(summary, extractSumMeta($, '#metadataDisplayInformation'));
		// return array of tags
		tags = extractTags($, '#metadataDisplayMain');
	} else {
		console.log(colors.red.bold("no meta data found"));
		return false;
	}
	// add the summary url
	summary.url = url;

	// finaly send all data to saveSummary
	// it will take care of checking the tags and saving tags and docs as well
	database.saveSummary(summary, tags, documents);

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
		tempObj.description = data.find("#documentViewerSummary").text().trim();
		if(tempObj.description === "---" || tempObj.description === "- - -" || tempObj.description === "" || tempObj.description === "..." || tempObj.description === ". . ."){
			tempObj.description = "No description found";
		}
	});
	return tempObj;
}

function extractSumMeta($, queryString){
	var tempObj = {};
	$(queryString).filter(function(){
		let data = $(this);
		tempObj.publisher = data.find(".metadataDisplayRightColumn").eq(0).text().trim();
		tempObj.published = data.find(".metadataDisplayRightColumn").eq(1).text().trim();
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
					label: $(el).text().trim(),
					url: "http://lifos.migrationsverket.se"+$(el).children('a').eq(0).attr('href'),
					type: "pdf"
				});
			} else {
				tempArr.push({
					label: $(el).text(),
					url: $(el).text(),
					type: "external"
				});
			}
		});
	});
	return tempArr;
}