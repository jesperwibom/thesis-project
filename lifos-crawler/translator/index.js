'use strict';

const colors	= require('colors/safe');
const translate= require('google-translate-api');

module.exports.translateTag = function(tag,sumId,sumUrl,callback){
	translate(tag, {to: 'en'})
		.then(res => {
			var trans = res.text.toLowerCase();
			callback(tag, trans, sumId, sumUrl);
			return true;
		}).catch(err => {
			console.log(tag+" COULD NOT FIND TRANSLATION ", err);
			callback(tag, "NOT_TRANSLATED", sumId, sumUrl);
	});
}

module.exports.translateSum = function(sum,tags,callback){
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

	translate(sum.title, {to: 'en'})
		.then(res => {
			trans.title = res.text;
			gate.title = true;
			if(gate.title && gate.abstract && gate.summary){
				callback(sum,trans,tags);
			}
			return true;
		}).catch(err => {
			console.log(sum.title+" COULD NOT FIND TRANSLATION ", err);
			if(gate.title && gate.abstract && gate.summary){
				callback(sum,trans,tags);
			}
	});

	translate(sum.abstract, {to: 'en'})
		.then(res => {
			trans.abstract = res.text;
			gate.abstract = true;
			if(gate.title && gate.abstract && gate.summary){
				callback(sum,trans,tags);
			}
			return true;
		}).catch(err => {
			console.log(sum.abstract+" COULD NOT FIND TRANSLATION ", err);
			if(gate.title && gate.abstract && gate.summary){
				callback(sum,trans,tags);
			}
	});

	translate(sum.summary, {to: 'en'})
		.then(res => {
			trans.summary = res.text;
			gate.summary = true;
			if(gate.title && gate.abstract && gate.summary){
				callback(sum,trans,tags);
			}
			return true;
		}).catch(err => {
			console.log(sum.summary+" COULD NOT FIND TRANSLATION ", err);
			if(gate.title && gate.abstract && gate.summary){
				callback(sum,trans,tags);
			}
	});
}
