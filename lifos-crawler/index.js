#!/usr/bin/env node

'use strict';

const colors	= require("colors/safe");
const radio     = require("radio");
const crawler 	= require('./crawler/index');
const scraper 	= require('./scraper/index');
const database  = require("./dbUtil/index");

var firstPage = "http://lifos.migrationsverket.se/sokning/detaljerad-sokning.html?fullTextSearchType=allWords&baseQuery=&withoutWords=&allWordsInTitle=&countries=&subjectWords=&sources=&dateFieldName=disabled&searchSessionId=75949961394a4db8a3fb5ad8f8ad2bcc&sort=creationDate&page="+"1";

var _PORT 	= process.env.PORT || 3000;
var _URL 	= process.env.URL || firstPage;

radio('cache_update').subscribe(function(type){
    crawler.crawl(_URL, function(content,fetchUrl) {
        scraper.extractData(content,fetchUrl);
    });
});

database.updateCache('sumIndex');

// http://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits
process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
    if (options.cleanup) {
		console.log(colors.blue.bold("Exiting crawler\n"));
    }
    if (options.exit) {
    	console.log(colors.red.bold("\nCancel"));
    	process.exit();
    }
    if (err) console.log(err.stack);
}

process.on('exit', exitHandler.bind(null,{cleanup:true}));
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
