'use strict';

const cheerio = require('cheerio');
const colors	= require('colors/safe');

const tagSaver = require('../tagSaver/index');

module.exports.extractData = function(html,url) {

	var $ = cheerio.load(html);

	//test if page is a document page
	if (!$('#documentViewerContainer').length){
		console.log(colors.red.bold.dim("no document\n"));
		return false;
	} else {
		$('#documentViewerContainer').filter(function(){
			let data = $(this);

			let title = data.children().eq(1).text();

			console.log(colors.blue.bold("document data"));
			console.log(colors.bold("%s"), title);


		});
		if(!$('#metadataDisplayMain').length){
			console.log(colors.red.bold("no tags found\n"));
			return false;
		} else {
			$('#metadataDisplayMain').filter(function(){
				let data = $(this);
				let tags = data.find('#metadataDisplaySubjectword').text().split(", ");
				//console.log(colors.cyan(JSON.stringify(tags,null," ")));
				tagSaver.parse(tags);
			});
			console.log();
			return true;
		}



	}
};
