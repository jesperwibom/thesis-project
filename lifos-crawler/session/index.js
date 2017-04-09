'use strict';

var colors = require('colors/safe');

var session = {
	tagsBefore: 0,
	tagsWritten: 0,
	sumsBefore: 0,
	sumsWritten: 0,
	docsBefore: 0,
	docsWritten: 0,
	startPage: 0,
	lastPage: 0,
	crawlerIterations: 0,
	fetchedPages: []
};

module.exports.printSession = function(){
	console.log(colors.blue.bold('SESSION DATA:'));
	console.log("  tags before:\t"+colors.bold("%s"), session.tagsBefore);
	console.log("  tags written:\t"+colors.bold("%s"), session.tagsWritten);
	console.log("  sums before:\t"+colors.bold("%s"), session.sumsBefore);
	console.log("  sums written:\t"+colors.bold("%s"), session.sumsWritten);
	console.log("  docs before:\t"+colors.bold("%s"), session.docsBefore);
	console.log("  docs written:\t"+colors.bold("%s"), session.docsWritten);
	console.log("  start page: \t"+colors.bold("%s"), session.startPage);
	console.log("  last page:  \t"+colors.bold("%s"), session.lastPage);
	console.log("  iterations: \t"+colors.bold("%s"), session.crawlerIterations);
};

module.exports.setTagsBefore = function(number){session.tagsBefore = number;};
module.exports.addTagsWritten = function(number){session.tagsWritten += number;};
module.exports.setSumsBefore = function(number){session.sumsBefore = number;};
module.exports.addSumsWritten = function(number){session.sumsWritten += number;};
module.exports.setDocsBefore = function(number){session.docsBefore = number;};
module.exports.addDocsWritten = function(number){session.docsWritten += number;};

module.exports.setStartPage = function(number){session.startPage = number;};
module.exports.setLastPage = function(number){session.lastPage = number;};
module.exports.addCrawlerIterations = function(number){session.crawlerIterations += number;};

module.exports.pageFetched = function(pageNr){
	session.fetchedPages.push(pageNr);
};
module.exports.isFetched = function(pageNr){
	if(session.fetchedPages.indexOf(pageNr) > -1){
		return true;
	}
	return false;
};