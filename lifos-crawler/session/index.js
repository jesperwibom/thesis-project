'use strict';

var colors = require('colors/safe');

var session = {
	noTagsBefore: 0,
	tagsWritten: 0,
	tagsSkipped: 0,
	noSumsBefore: 0,
	sumsWritten: 0,
	sumsSkipped: 0,
	startPage: 0,
	lastPage: 0,
	crawlerIterations: 0
};

module.exports.printSession = function(){
	console.log(colors.blue.bold('SESSION DATA:'));
	console.log("  tags before:\t"+colors.bold("%s"), session.noTagsBefore);
	console.log("  tags written:\t"+colors.bold("%s"), session.tagsWritten);
	console.log("  tags skipped:\t"+colors.bold("%s"), session.tagsSkipped);
	console.log("  sums before:\t"+colors.bold("%s"), session.noSumsBefore);
	console.log("  sums written:\t"+colors.bold("%s"), session.sumsWritten);
	console.log("  sums skipped:\t"+colors.bold("%s"), session.sumsSkipped);
	console.log("  start page: \t"+colors.bold("%s"), session.startPage);
	console.log("  last page:  \t"+colors.bold("%s"), session.lastPage);
	console.log("  iterations: \t"+colors.bold("%s"), session.crawlerIterations);
};

module.exports.setNoTagsBefore = function(number){
	session.noTagsBefore = number;
};
module.exports.addTagsWritten = function(number){
	session.tagsWritten += number;
};
module.exports.addTagsSkipped = function(number){
	session.tagsSkipped += number;
};

module.exports.setNoSumsBefore = function(number){
	session.noSumsBefore = number;
};
module.exports.addSumsWritten = function(number){
	session.sumsWritten += number;
};
module.exports.addSumsSkipped = function(number){
	session.sumsSkipped += number;
};

module.exports.setStartPage = function(number){
	session.startPage = number;
};
module.exports.setLastPage = function(number){
	session.lastPage = number;
};

module.exports.addCrawlerIterations = function(number){
	session.crawlerIterations += number;
};