'use strict';

const Crawler 	= require('simplecrawler');
const colors	= require('colors/safe');

module.exports.crawl = function(url, callback) {
	let crawler = new Crawler(url);

	crawler.interval				= 1000;
	crawler.maxConcurrency		= 1;
	crawler.maxDepth				= 2;
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
		"kontakta-lifos"
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

	var ignoreUrlsRegExp = getIgnoreUrlsRegExp(ignoreUrls);

	// CONDITIONS
	var conditionIgnoreUrls = crawler.addFetchCondition(function(queueItem, referrerQueueItem, callback) {
		callback(null, !queueItem.path.match(ignoreUrlsRegExp));
	});
	var conditionIgnoreEndings = crawler.addFetchCondition(function(queueItem, referrerQueueItem, callback) {
		callback(null, !queueItem.path.match(/\.(css|js|jpg|jpeg|gif|png|ico|portlet|dtd)$/i));
	});
	var conditionIgnoreRssPortlet = crawler.addFetchCondition(function(queueItem, referrerQueueItem, callback) {
		callback(null, !queueItem.path.match(/\.(rss|portlet)/i)); //.rss OR .portlet (not neccesarily ending)
	});
	var conditionFollowOnce = crawler.addFetchCondition(function(queueItem, referrerQueueItem, callback){
		callback(null, referrerQueueItem.host === crawler.host);
	});

	crawler.on("crawlstart", function() {
		console.log(colors.blue.bold("\nCrawler started"));
		console.log("host:\t"+colors.bold("%s\n"), crawler.host);
	});

	crawler.on("complete", function(){
		console.log(colors.blue.bold("\nCrawler finished"));
		process.exit();
	});

	crawler.on("fetchcomplete", function(queueItem, responseBuffer, response) {
		console.log(colors.black.bgGreen.bold("Fetch complete:")+" "+colors.yellow.bold("%s")+" "+colors.yellow.dim("(%d bytes)"), queueItem.url, responseBuffer.length);
		console.log(colors.dim("content-type: ")+colors.bold.dim("\t%s"), response.headers['content-type']);

		callback(responseBuffer);
	});

	crawler.start();
};