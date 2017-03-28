#!/usr/bin/env node

'use strict';

const firebase = require("firebase");
const confirm 	= require('confirm-cli');
const colors	= require('colors/safe');

var config = {
	apiKey: "AIzaSyD93bqwNxuyflXc0AFAGhx6QdaFJQQ8yZQ",
	authDomain: "lifosalternativesearch.firebaseapp.com",
	databaseURL: "https://lifosalternativesearch.firebaseio.com",
	storageBucket: "lifosalternativesearch.appspot.com",
	messagingSenderId: "658803108313"
};

firebase.initializeApp(config);
const database = firebase.database();

console.log(colors.red.bold("\nWARNING!\nThis will completely erase the database.\n"))
confirm('CONTINUE?',
	function() {
		console.log('selected yes');
		firebase.database().ref('/').set(null,function(){
			console.log(colors.red.bold("DATABASE ERASED"));
			process.exit();
		});
	}, function() {
 		console.log('selected no');
 		process.exit();
	}
);

