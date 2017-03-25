#!/usr/bin/env node

'use strict';

const fs			= require("fs");
const colors	= require("colors/safe");
//const express 	= require('express');

const crawler 	= require('./crawler/index');
const scraper 	= require('./scraper/index');
const tagSaver = require('./tagSaver/index');

var _PORT 	= process.env.PORT || 3000;
var _URL 	= process.env.URL || "http://lifos.migrationsverket.se/";
var _TAGSPATH = process.env.TAGSPATH || './data/tags.master.json';
// fs check for file
// fs get file tags.master.json

fs.readFile(_TAGSPATH, 'utf8', (err, data) => {
	if (err) {
		console.log(colors.red("\nCANNOT FIND tags.master.json"));
		console.log("A new file will be created");
	} else {
		console.log(colors.green("\nFOUND tags.master.json"));
		tagSaver.setCache(data);
	}

	crawler.crawl(_URL, function(content) {
		scraper.extractData(content);
	});
});


// http://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits
process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
    if (options.cleanup) {
    	console.log(colors.blue.dim("TESTED TAGS: ")+colors.blue.dim.bold(tagSaver.getSessionData().testedTags));
    	console.log(colors.blue.dim("ADDED TAGS: ")+colors.blue.dim.bold(tagSaver.getSessionData().addedTags));
    	console.log(colors.blue.bold("Writing tags.master.json ..."));
    	var cache = tagSaver.getCache();
    	fs.writeFileSync(_TAGSPATH, cache, "utf-8");
		console.log(colors.blue.bold("Exiting crawler\n"));
    }
    if (options.exit) {
    	console.log(colors.red.bold("\nCancel"));
    	process.exit();
    }
    if (err) console.log(err.stack);
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));
//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
