'use strict';

const Crawler 	= require('simplecrawler');
const colors	= require('colors/safe');
const database = require("../database/index");
const radio 	= require("radio");
const session  = require("../session/index");

module.exports.crawl = function(url, callback) {
	let crawler = new Crawler(url);
	let firstPage = parseInt(url.split('=').pop());

	crawler.interval				= 20;
	crawler.maxConcurrency		= 20;
	crawler.maxDepth				= 3;
	crawler.respectRobotsTxt	= false;
	crawler.filterByDomain 		= false; //see the fetch conditions
	crawler.domainWhitelist		= ["http://lifos.migrationsverket.se/","http://www.migrationsverket.se/","http://migrationsverket.se/"];

	var ignoreUrls = [
		"detaljerad-sokning",
		"fokuslander",
		"sokning",
		"rattsfallssamling",
		"lanksamling",
		"easo-coi-portal",
		"om-lifos",
		"kontakta-lifos",
		"sokhjalp",
		"amnesord",
		"kallor"
	];

	function getIgnoreUrlsRegExp(urls){
		let urlStr = "(";
		for (var i=0; i<urls.length; i++){
			urlStr += urls[i];
			if(i!=urls.length-1){
				urlStr += "|";
			}
		}
		urlStr += ")\.(html)$"
		return new RegExp(urlStr, 'i');
	};

	// create common pages ignore RegExp
	var ignoreUrlsRegExp = getIgnoreUrlsRegExp(ignoreUrls);
	// from cache get already stored summaries (not a call to the database, only checking local cache)
	var alreadyParsedUrls = database.getCache('sumIndex');

	// CONDITIONS
	// Setting conditions for crawler to ignore pages
	// Ignore common urls:
	var conditionIgnoreUrls = crawler.addFetchCondition(function(queueItem, referrerQueueItem, callback) {
		callback(null, !queueItem.path.match(ignoreUrlsRegExp));
	});
	// Ignore already stored summaries:
	var conditionIgnoreSums = crawler.addFetchCondition(function(queueItem, referrerQueueItem, callback) {
		var id = queueItem.path.split('=')[1];
		if(alreadyParsedUrls[id]){
			session.addSumsSkipped(1);
		}
		callback(null, !alreadyParsedUrls[id]);
	});
	// Ignore to high or to low page numbers in relation to settings ( asylum-search/index.js ):
	var conditionIgnorePages = crawler.addFetchCondition(function(queueItem, referrerQueueItem, callback){
		if(!queueItem.path.match(/(page)\=[0-9]+$/i)){
			callback(null, true);
		} else {
			//console.log('PAGE url');
			var pageNr = queueItem.path.split("=").pop();
			if(pageNr < (firstPage-10) || pageNr > (firstPage+10)){
				//console.log('PAGE url TO HIGH/LOW');
				callback(null, false);
			} else {
				callback(null, true);
			}
		}
	});
	// Don't fetch specific file types/resources:
	var conditionIgnoreEndings = crawler.addFetchCondition(function(queueItem, referrerQueueItem, callback) {
		callback(null, !queueItem.path.match(/\.(css|js|jpg|jpeg|gif|png|ico|portlet|dtd|pdf)$/i));
	});
	// Don't fetch category pages:
	var conditionIgnoreCategoryPage = crawler.addFetchCondition(function(queueItem, referrerQueueItem, callback) {
		callback(null, !queueItem.path.match(/(category)\=[0-9]+$/i));
	});
	// Ignore rss and portlet endings:
	var conditionIgnoreRssPortlet = crawler.addFetchCondition(function(queueItem, referrerQueueItem, callback) {
		callback(null, !queueItem.path.match(/\.(rss|portlet)/i)); //.rss OR .portlet (not neccesarily ending)
	});
	// Allow to follow one step outside of original domain (to be able to follow linked material on other domains than 'migrationsverket.se')
	var conditionFollowOnce = crawler.addFetchCondition(function(queueItem, referrerQueueItem, callback){
		callback(null, referrerQueueItem.host === crawler.host);
	});

	// Log event crawlstart
	crawler.on("crawlstart", function() {
		console.log(colors.bgBlue.black.bold("> > >\t> > >\t> > >"));
		console.log(colors.blue.bold("Crawl started"));
		console.log("host:\t"+colors.bold("%s"), crawler.host+"\n");
	});

	// Log event complete and publish event crawl_complete
	crawler.on("complete", function(){
		console.log(colors.blue.bold("\nCrawl finished"));
		console.log(colors.bgBlue.black.bold("< < <\t< < <\t< < <"));
		radio('crawl_complete').broadcast("next");
	});

	// When fetch is complete (fetchConditions apply) log and call callback function ( scarper.extractData)
	crawler.on("fetchcomplete", function(queueItem, responseBuffer, response) {
		//console.log(colors.black.bgGreen.bold("Fetch complete:")+" "+colors.yellow.bold.dim("%s")+" "+colors.yellow.dim("(%d bytes)"), queueItem.url, responseBuffer.length);
		//console.log(colors.dim("content-type: ")+colors.bold.dim("\t%s"), response.headers['content-type']);
		callback(responseBuffer,queueItem.url);
	});

	crawler.start();
};