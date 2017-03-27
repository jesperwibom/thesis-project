#!/usr/bin/env node

'use strict';

const colors	= require("colors/safe");
const radio     = require("radio");
const crawler 	= require('./crawler/index');
const scraper 	= require('./scraper/index');
const database  = require("./database/index");
const session  = require("./session/index");

var mainUrl = "http://lifos.migrationsverket.se/sokning/detaljerad-sokning.html?fullTextSearchType=allWords&baseQuery=&withoutWords=&allWordsInTitle=&countries=&subjectWords=&sources=&dateFieldName=disabled&searchSessionId=75949961394a4db8a3fb5ad8f8ad2bcc&sort=creationDate&page=";

const startPage = 1;
var currentPage = startPage;

session.setStartPage(startPage);

radio('cache_update').subscribe(function(type,numberOf){
    switch (type) {
        case 'tagIndex':
            session.setNoTagsBefore(numberOf);
            break;
        case 'sumIndex':
            session.setNoSumsBefore(numberOf);
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
});

database.updateCache('sumIndex');
database.updateCache('tagIndex');

radio('crawl_complete').subscribe(function(url){
    console.log(colors.yellow.bold("\nCHECKING FOR NEW CRAWL ...\n"));
    currentPage === 1 ? currentPage = 15 : currentPage += 10;
    if(currentPage < startPage+26){
        crawler.crawl(mainUrl+currentPage, function(content,fetchUrl) {
            scraper.extractData(content,fetchUrl);
        });
    } else {
        session.setLastPage(currentPage);
        console.log(colors.blue.bold("Max number of consecutive iterations reached"));
        console.log(colors.blue.dim("Run program again but set startPage to a higher number\n"));
        process.exit();
    }

});

process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
    if (options.cleanup) {
        session.printSession();
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
