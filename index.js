'use strict';

process.env.DEBUG = 'actions-on-google:*';

const Assistant = require('actions-on-google').ApiAiAssistant;
const functions = require('firebase-functions');
var admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

var db = admin.database();
var ref = db.ref("/transamerica-dummy-data");

// API.AI Intent names
const ACCT_LOOKUP_INTENT = 'Account-Lookup';

// Context Parameters
const ACCT_ID = 'acctNum';

exports.assistantcodelab = functions.https.onRequest((request, response) => {
    console.log('headers: ' + JSON.stringify(request.headers));
    console.log('body: ' + JSON.stringify(request.body));

    const assistant = new Assistant({request: request, response: response});
    //Handles which function to call
    let actionMap = new Map();
    actionMap.set(ACCT_LOOKUP_INTENT, AccountFind);
    assistant.handleRequest(actionMap);
    

	//Finds Name of Person on account, given account number
function AccountFind(assistant){
	var req = request.body.result.parameters.acctNum;
	ref.on("child_added",function(snapshot) {
		var custName = snapshot.child(req).child("customer").val();
		if(custName!==null)
		{
			console.log('Name for # '+ req +' is '+ custName);
			var speech="It looks like "+custName+" owns account #"+req;
			assistant.ask(speech);
		}
		else
		{
			assistant.ask("I can't find anyone with that account number");	
		}
	});
}


});
