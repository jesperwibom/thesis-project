'use strict';

const colors	= require('colors/safe');
const translate= require('google-translate-api');

module.exports.translateTag = function(tag,sumId,sumUrl,callback){
	translate(tag, {from: 'sv', to: 'en'})
		.then(res => {
			var trans = res.text.toLowerCase();
			callback(tag, trans, sumId, sumUrl);
			return true;
		}).catch(err => {
			console.log(colors.red.bold("COULD NOT FIND TRANSLATION :"),tag,err.code);
			callback(tag, "NOT_TRANSLATED", sumId, sumUrl);
	});
}

module.exports.translateSum = function(sum,tags,docs,callback){
	var gate = {
		title: false,
		abstract: false,
		summary: false
	};
	var trans = {
		title: "NOT_TRANSLATED",
		abstract: "NOT_TRANSLATED",
		summary: "NOT_TRANSLATED"
	};

	var lengthAbstract = 600;
	var trimmedAbstract = sum.abstract.length > lengthAbstract ?
                    		sum.abstract.substring(0, lengthAbstract) + "... MASKINLÄSNING BEGRÄNSAD":
                    		sum.abstract;

	var lengthSummary = 1000;
	var trimmedSummary = sum.summary.length > lengthSummary ?
                    		sum.summary.substring(0, lengthSummary) + "... MASKINLÄSNING BEGRÄNSAD":
                    		sum.summary;

	translate(sum.title, {to: 'en'})
		.then(res => {
			trans.title = res.text;
			gate.title = true;
			if(gate.title && gate.abstract && gate.summary){
				callback(sum,trans,tags,docs);
			}
			return true;
		}).catch(err => {
			console.log(colors.red.bold("COULD NOT FIND TRANSLATION : title :"),sum.title,err.code);
			gate.title = true;
			if(gate.title && gate.abstract && gate.summary){
				callback(sum,trans,tags,docs);
			}
	});

	translate(trimmedAbstract, {to: 'en'})
		.then(res => {
			trans.abstract = res.text;
			gate.abstract = true;
			if(gate.title && gate.abstract && gate.summary){
				callback(sum,trans,tags,docs);
			}
			return true;
		}).catch(err => {
			console.log(colors.red.bold("COULD NOT FIND TRANSLATION : abstract :"),trimmedAbstract,err.code);
			gate.abstract = true;
			if(gate.title && gate.abstract && gate.summary){
				callback(sum,trans,tags,docs);
			}
	});

	translate(trimmedSummary, {to: 'en'})
		.then(res => {
			trans.summary = res.text;
			gate.summary = true;
			if(gate.title && gate.abstract && gate.summary){
				callback(sum,trans,tags,docs);
			}
			return true;
		}).catch(err => {
			console.log(colors.red.bold("COULD NOT FIND TRANSLATION : summary :"),trimmedSummary,err.code);
			gate.summary = true;
			if(gate.title && gate.abstract && gate.summary){
				callback(sum,trans,tags,docs);
			}
	});
}
