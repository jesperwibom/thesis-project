#!/usr/bin/env node

'use strict';

const colors	= require("colors/safe");
// const radio     = require("radio");
const crawler 	= require('./crawler/index');
const scraper 	= require('./scraper/index');
const database  = require("./database/index");
// const session  = require("./session/index");

// need to be updated before run
var sessionId = "69307288adc94ea4a32a79e0fc402f9c";
// Lifos detailed search sorted by date
var mainUrl = "http://lifos.migrationsverket.se/sokning/detaljerad-sokning.html?fullTextSearchType=allWords&baseQuery=&withoutWords=&allWordsInTitle=&countries=&subjectWords=&sources=&dateFieldName=disabled&searchSessionId="+sessionId+"&sort=creationDate&page=";

const START_PAGE = 1;
const MAX_PAGE = 10;
var currentPage = START_PAGE;

console.log('STARTING');

database.setCacheListeners(mainUrl+currentPage,function(startUrl){
    crawler.crawl(startUrl, function(content,fetchUrl) {
        scraper.extractData(content,fetchUrl);
    });
});









// session.setStartPage(START_PAGE);

/*
//update cache, will send out event when done
database.updateCache('sumIndex');
database.updateCache('tagIndex');

//when data is cached...
radio('cache_update').subscribe(function(type,numberOf){
    switch (type) {
        case 'tagIndex':
            session.setNoTagsBefore(numberOf);
            break;
        case 'sumIndex':
            session.setNoSumsBefore(numberOf);
            //when sumIndex is updated start crawl
            // crawler.crawl take to args: start url, callback function
            crawler.crawl(mainUrl+currentPage, function(content,fetchUrl) {
                scraper.extractData(content,fetchUrl);
            });
            break;
        case 'docIndex':
            //session.setNoSumsBefore(numberOf);
            break;
        default:
            console.log('cache_update problem');
            break;
    }
});*/

/*
// when crawl is complete...
radio('crawl_complete').subscribe(function(url){
    session.addCrawlerIterations(1);
    console.log(colors.yellow.bold("\nCHECKING FOR NEW CRAWL ...\n"));
    currentPage === 1 ? currentPage = 15 : currentPage += 10;
    if(currentPage < START_PAGE+MAX_PAGE){
        crawler.crawl(mainUrl+currentPage, function(content,fetchUrl) {
            scraper.extractData(content,fetchUrl);
        });
    } else {
        console.log(colors.blue.bold("Max number of consecutive iterations reached"));
        console.log(colors.blue.dim("Run program again but set START_PAGE to a higher number\n"));
        process.exit();
    }

});*/





process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
    if (options.cleanup) {
        // session.setLastPage(currentPage);
        // session.printSession();
		console.log(colors.blue.bold("Exiting crawler\n"));
    }
    if (options.exit) {
    	console.log(colors.red.bold("\nCANCEL"));
    	process.exit();
    }
    if (err) console.log(err.stack);
}

process.on('exit', exitHandler.bind(null,{cleanup:true}));
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
