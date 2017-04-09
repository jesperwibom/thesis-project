#!/usr/bin/env node --max_old_space_size=4096 --optimize_for_size --max_executable_size=4096 --stack_size=4096

'use strict';

const colors	= require("colors/safe");
const radio     = require("radio");
const crawler 	= require('./crawler/index');
const scraper 	= require('./scraper/index');
const database  = require("./database/index");
const session  = require("./session/index");

// need to be updated before run
var sessionId = "68ac57c075334364841437bf6deac46e";
// Lifos detailed search sorted by date
var mainUrl = "http://lifos.migrationsverket.se/sokning/detaljerad-sokning.html?fullTextSearchType=allWords&baseQuery=&withoutWords=&allWordsInTitle=&countries=&subjectWords=&sources=&dateFieldName=disabled&searchSessionId="+sessionId+"&sort=creationDate&page=";

// set crawler to start on a specific page
const START_PAGE = 103;
// the number of pages higher than start_page that it can crawl
const MAX_PAGE = 100;
// set current page to start_page
var currentPage = START_PAGE;

console.log('STARTING');
session.setStartPage(START_PAGE);

database.setCacheListeners(mainUrl+currentPage,function(startUrl){
    crawler.crawl(startUrl, function(content,fetchUrl) {
        scraper.extractData(content,fetchUrl);
    });
});

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

});

process.stdin.resume();//so the program will not close instantly
process.on('exit', exitHandler.bind(null,{cleanup:true}));
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

function exitHandler(options, err) {
    if (options.cleanup) {
        session.setLastPage(currentPage);
        session.printSession();
        console.log(colors.blue.bold("Exiting crawler\n"));
    }
    if (options.exit) {
        console.log(colors.red.bold("\nCANCEL"));
        process.exit();
    }
    if (err) console.log(err.stack);
}