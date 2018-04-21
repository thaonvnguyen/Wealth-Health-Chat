'use strict';

process.env.DEBUG = 'actions-on-google:*';

const Assistant = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');
var admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

var db = admin.database();
var ref = db.ref("/transamerica-dummy-data");
var maxPeoplePerAccount = 10;

// API.AI Intent names
const OWNER_LOOKUP_INTENT = 'Owner-Lookup';
const EVERYONE_LOOKUP_INTENT = 'Everyone-Lookup';
const CASH_VALUE_LOOKUP_INTENT = 'Cash-Value-Lookup';
const COVERAGE_PHASE_LOOKUP_INTENT = 'Coverage-Phase-Lookup';
const INITIAL_PREMIUM_LOOKUP_INTENT = 'Initial-Premium-Lookup';
const ISSUE_DATE_LOOKUP_INTENT = 'Issue-Date-Lookup';
const PAYOUT_VALUE_LOOKUP_INTENT = 'Payout-Value-Lookup';
const POLICY_NUM_LOOKUP_INTENT = 'Policy-Num-Lookup';
const PRODUCT_NAME_LOOKUP_INTENT = 'Product-Name-Lookup';
const PRODUCT_TYPE_LOOKUP_INTENT = 'Product-Type-Lookup';
const STATUS_LOOKUP_INTENT = 'Status-Lookup';
const TERMINATION_DATE_LOOKUP_INTENT = 'Termination-Date-Lookup';
const DOB_LOOKUP_INTENT = 'DOB-Lookup';
const GENDER_LOOKUP_INTENT = 'Gender-Lookup';
const ADDRESS_LOOKUP_INTENT = 'Address-Lookup';
const PHONE_LOOKUP_INTENT = 'Phone-Lookup';
const SSN_LOOKUP_INTENT = 'SSN-Lookup';
const EMAIL_LOOKUP_INTENT = 'Email-Lookup';
const ROLE_LOOKUP_INTENT = 'Role-Lookup';
const MASTER_LOOKUP_INTENT = 'master';


const CASH_VALUE_UPDATE_INTENT = 'Cash-Value-Update';
const COVERAGE_PHASE_UPDATE_INTENT = 'Coverage-Phase-Update';
const INITIAL_PREMIUM_UPDATE_INTENT = 'Initial-Premium-Update';
const ISSUE_DATE_UPDATE_INTENT = 'Issue-Date-Update';
const PAYOUT_VALUE_UPDATE_INTENT = 'Payout-Value-Update';
const POLICY_NUM_UPDATE_INTENT = 'Policy-Num-Update';
const PRODUCT_NAME_UPDATE_INTENT = 'Product-Name-Update';
const PRODUCT_TYPE_UPDATE_INTENT = 'Product-Type-Update';
const STATUS_UPDATE_INTENT = 'Status-Update';
const TERMINATION_DATE_UPDATE_INTENT = 'Termination-Date-Update';
const DOB_UPDATE_INTENT = 'DOB-Update';
const GENDER_UPDATE_INTENT = 'Gender-Update';
const ADDRESS_UPDATE_INTENT = 'Address-Update';
const PHONE_UPDATE_INTENT = 'Phone-Update';
const SSN_UPDATE_INTENT = 'SSN-Update';
const EMAIL_UPDATE_INTENT = 'Email-Update';
const ROLE_UPDATE_INTENT = 'Role-Update';

// Context Parameters
const ACCT_ID = 'acctNum';

exports.assistantcodelab = functions.https.onRequest((request, response) => {
    console.log('headers: ' + JSON.stringify(request.headers));
    console.log('body: ' + JSON.stringify(request.body));

    const assistant = new Assistant({request: request, response: response});
    //Handles which function to call
    let actionMap = new Map();
	actionMap.set(OWNER_LOOKUP_INTENT, OwnerFind);
	actionMap.set(EVERYONE_LOOKUP_INTENT, EveryoneFind);
	actionMap.set(CASH_VALUE_LOOKUP_INTENT, cashValueFind);
	actionMap.set(COVERAGE_PHASE_LOOKUP_INTENT, coveragePhaseFind);
	actionMap.set(INITIAL_PREMIUM_LOOKUP_INTENT, initialPremiumFind);
	actionMap.set(ISSUE_DATE_LOOKUP_INTENT, issueDateFind);
	actionMap.set(PAYOUT_VALUE_LOOKUP_INTENT, payoutValueFind);
	actionMap.set(POLICY_NUM_LOOKUP_INTENT, policyNumberFind);
	actionMap.set(PRODUCT_NAME_LOOKUP_INTENT, productNameFind);
	actionMap.set(PRODUCT_TYPE_LOOKUP_INTENT, productTypeFind);
	actionMap.set(STATUS_LOOKUP_INTENT, statusFind);
	actionMap.set(TERMINATION_DATE_LOOKUP_INTENT, terminationDateFind);
	actionMap.set(DOB_LOOKUP_INTENT, DOBFind);
	actionMap.set(GENDER_LOOKUP_INTENT, genderFind);
	actionMap.set(ADDRESS_LOOKUP_INTENT, addressFind);
	actionMap.set(PHONE_LOOKUP_INTENT, phoneFind);
	actionMap.set(SSN_LOOKUP_INTENT, ssnFind);
	actionMap.set(EMAIL_LOOKUP_INTENT, emailFind);
	actionMap.set(ROLE_LOOKUP_INTENT, roleFind);

	actionMap.set(CASH_VALUE_UPDATE_INTENT, cashValueUpdate);
	actionMap.set(COVERAGE_PHASE_UPDATE_INTENT, coveragePhaseUpdate);
	actionMap.set(INITIAL_PREMIUM_UPDATE_INTENT, initialPremiumUpdate);
	actionMap.set(ISSUE_DATE_UPDATE_INTENT, issueDateUpdate);
	actionMap.set(PAYOUT_VALUE_UPDATE_INTENT, payoutValueUpdate);
	actionMap.set(POLICY_NUM_UPDATE_INTENT, policyNumberUpdate);
	actionMap.set(PRODUCT_NAME_UPDATE_INTENT, productNameUpdate);
	actionMap.set(PRODUCT_TYPE_UPDATE_INTENT, productTypeUpdate);
	actionMap.set(STATUS_UPDATE_INTENT, statusUpdate);
	actionMap.set(TERMINATION_DATE_UPDATE_INTENT, terminationDateUpdate);
	actionMap.set(DOB_UPDATE_INTENT, DOBUpdate);
	actionMap.set(GENDER_UPDATE_INTENT, genderUpdate);
	actionMap.set(ADDRESS_UPDATE_INTENT, addressUpdate);
	actionMap.set(PHONE_UPDATE_INTENT, phoneUpdate);
	actionMap.set(SSN_UPDATE_INTENT, ssnUpdate);
	actionMap.set(EMAIL_UPDATE_INTENT, emailUpdate);
	actionMap.set(ROLE_UPDATE_INTENT, roleUpdate);
	actionMap.set(MASTER_LOOKUP_INTENT, masterFind);
	assistant.handleRequest(actionMap);
    

	//Finds Name of Person on account, given account number
function OwnerFind(assistant){
	var req = request.body.result.parameters.acctNum;
	var role;
	var found = 0;
	ref.on("child_added",function(snapshot) {
		for(var x=0;x<maxPeoplePerAccount;x++)
		{
			role = snapshot.child(req).child("people").child(x).child("role").val();
			if(role === 'Primary Owner')
			{
				found = 1;
				//assistant.ask(snapshot.child(req).child("people").child(x).child("firstName").val() + " " + snapshot.child(req).child("people").child(x).child("lastName").val() + " is the owner of account number "+req);getting context form webhook dialogflow
	var fulfilment = {
	contextOut: [
        {
            "name": "username",
            "lifespan": 1,
            "parameters": {
                "firstName":snapshot.child(req).child("people").child(x).child("firstName").val() ,
                "lastName": snapshot.child(req).child("people").child(x).child("lastName").val()
            }
        }
    ]
}
console.log("response: ", fulfilment);
response.json(fulfilment);
			}
		}
		if(found === 0)
			assistant.ask('Sorry, I could not find the owner of that account number');
	});
}

//Finds the names of everyone on an account, given account number
function EveryoneFind(assistant){
	var req = request.body.result.parameters.acctNum;
	var x = 0;
	ref.on("child_added",function(snapshot) {
		if(snapshot.child(req).child("people").child(x).child("firstName").val() !== null)
		{
		var names = snapshot.child(req).child("people").child(x).child("firstName").val() + ' ' + snapshot.child(req).child("people").child(x).child("lastName").val();
		for(x=1;x<maxPeoplePerAccount;x++)
		{
			if(snapshot.child(req).child("people").child(x).child("firstName").val() !== null)
			{
				names = names + ', ' +snapshot.child(req).child("people").child(x).child("firstName").val() + ' ' + snapshot.child(req).child("people").child(x).child("lastName").val();
			}
		}
		assistant.ask('Here is a list of everyone I found on that account: '+names);
		}
		else
			assistant.ask('I could not find that account number');
	});
}

//Finds cash value, given account number
function cashValueFind(assistant){
	var req = request.body.result.parameters.acctNum;
	ref.on("child_added",function(snapshot) {
	//assistant.ask('It looks like the cash value of that account is $'+snapshot.child(req).child("cashValue").val());
	var fulfilment = {
	contextOut: [
        {
            "name": "cashvalue",
            "lifespan": 10,
            "parameters": {
                "cashval":snapshot.child(req).child("cashValue").val()
            }
        }
    ]
}
console.log("response: ", fulfilment);
response.json(fulfilment);
	});	
}

//Finds coverage phase, given account number
function coveragePhaseFind(assistant){
var req = request.body.result.parameters.acctNum;
	ref.on("child_added",function(snapshot) {
assistant.ask('It looks like the coverage phase of that account is currently '+snapshot.child(req).child("coveragePhase").val());	
	});
}
//Finds initialPremium, given account number
function initialPremiumFind(assistant){
var req = request.body.result.parameters.acctNum;
	ref.on("child_added",function(snapshot) {
assistant.ask('It looks like the initial premium for that account is $'+snapshot.child(req).child("initialPremium").val());	
	});
}
//Finds issue date, given account number
function issueDateFind(assistant){
var req = request.body.result.parameters.acctNum;
	ref.on("child_added",function(snapshot) {
		assistant.ask('It looks like that account was created on '+snapshot.child(req).child("issueDate").val());
	});
}
//Finds payout value, given account number
function payoutValueFind(assistant){
var req = request.body.result.parameters.acctNum;
	ref.on("child_added",function(snapshot) {
	assistant.ask('It looks like the payout value of that account is $'+snapshot.child(req).child("payoutValue").val());
	});
}
//Finds policy Number, given account number
function policyNumberFind(assistant){
var req = request.body.result.parameters.acctNum;
	ref.on("child_added",function(snapshot) {
	assistant.ask('It looks like the policy number on that account is '+snapshot.child(req).child("policyNum").val());
	});
}
//Finds product name, given account number
function productNameFind(assistant){
var req = request.body.result.parameters.acctNum;
	ref.on("child_added",function(snapshot) {
assistant.ask('It looks like that account has '+snapshot.child(req).child("productName").val());	
	});
}
//Finds product type, given account number
function productTypeFind(assistant){
var req = request.body.result.parameters.acctNum;
	ref.on("child_added",function(snapshot) {
	assistant.ask('It looks like the product on that account is  '+snapshot.child(req).child("productType").val());
	});
}

//Finds account status, given account number
function statusFind(assistant){
var req = request.body.result.parameters.acctNum;
	ref.on("child_added",function(snapshot) {
	assistant.ask('It looks like that account is currently '+snapshot.child(req).child("status").val());
	});
}

//Finds terminationDate, given account number
function terminationDateFind(assistant){
var req = request.body.result.parameters.acctNum;
	ref.on("child_added",function(snapshot) {
	if(snapshot.child(req).child("terminationDate").val() !== 'N/A')
		assistant.ask('It looks like that account was terminated on '+snapshot.child(req).child("terminationDate").val());
	else
		assistant.ask('It looks like that that account has not been terminated yet.');
	});
}

//Finds date of birth, given account number and last 4 of social
function DOBFind(assistant){
	var req = request.body.result.parameters.acctNum;
	var lastSSN = request.body.result.parameters.ssn;
	var testSSN;
	ref.on("child_added",function(snapshot) {
	for(var x = 0; x < maxPeoplePerAccount;x++)
	{
		testSSN = snapshot.child(req).child("people").child(x).child("customerSSN").val()
		if(testSSN === null)
			break;
	testSSN = testSSN.substring(testSSN.length-4,testSSN.length);
		console.log('testSSN '+testSSN+', lastSSN '+ lastSSN);
		if(testSSN === lastSSN.toString())
		{
			assistant.ask('I see that ' +snapshot.child(req).child("people").child(x).child("firstName").val() + ' '+ snapshot.child(req).child("people").child(x).child("lastName").val()+'\'s DOB is '+ snapshot.child(req).child("people").child(x).child("DateOfBirth").val());
			testSSN = 'End';
			break;
		}

	}
	if(testSSN !== "End")
	assistant.ask('Sorry, I could not find anyone with that information');
	});
	
}

//Finds gender, given account number and last 4 of social
function genderFind(assistant){
var req = request.body.result.parameters.acctNum;
	var lastSSN = request.body.result.parameters.ssn;
	var testSSN;
	ref.on("child_added",function(snapshot) {
	for(var x = 0; x < maxPeoplePerAccount;x++)
	{
		testSSN = snapshot.child(req).child("people").child(x).child("customerSSN").val()
		if(testSSN === null)
			break;
	testSSN = testSSN.substring(testSSN.length-4,testSSN.length);
		console.log('testSSN '+testSSN+', lastSSN '+ lastSSN);
		if(testSSN === lastSSN.toString())
		{
			assistant.ask('I see that ' +snapshot.child(req).child("people").child(x).child("firstName").val() + ' '+ snapshot.child(req).child("people").child(x).child("lastName").val()+' is a '+ snapshot.child(req).child("people").child(x).child("Gender").val());
			testSSN = 'End';
			break;
		}

	}
	if(testSSN !== "End")
	assistant.ask('Sorry, I could not find anyone with that information');
	});

}

//Finds address, given account number and last 4 of social
function addressFind(assistant){
var req = request.body.result.parameters.acctNum;
	var lastSSN = request.body.result.parameters.ssn;
	var testSSN;
	ref.on("child_added",function(snapshot) {
	for(var x = 0; x < maxPeoplePerAccount;x++)
	{
		testSSN = snapshot.child(req).child("people").child(x).child("customerSSN").val();
		if(testSSN === null)
			break;
	testSSN = testSSN.substring(testSSN.length-4,testSSN.length);
		console.log('testSSN '+testSSN+', lastSSN '+ lastSSN);
		if(testSSN === lastSSN.toString())
		{
			assistant.ask('I see that ' +snapshot.child(req).child("people").child(x).child("firstName").val() + ' '+ snapshot.child(req).child("people").child(x).child("lastName").val()+'\'s address is \n'+ snapshot.child(req).child("people").child(x).child("addressStreet").val() + ' \n' +snapshot.child(req).child("people").child(x).child("addressCity").val()+ ', '+snapshot.child(req).child("people").child(x).child("addressState").val() + ' ' + snapshot.child(req).child("people").child(x).child("addressZip").val());
			testSSN = 'End';
			break;
		}

	}
	if(testSSN !== "End")
	assistant.ask('Sorry, I could not find anyone with that information');
	});
}

//Finds phone number, given account number and last 4 of social
function phoneFind(assistant){
var req = request.body.result.parameters.acctNum;
	var lastSSN = request.body.result.parameters.ssn;
	var testSSN;
	ref.on("child_added",function(snapshot) {
	for(var x = 0; x < maxPeoplePerAccount;x++)
	{
		testSSN = snapshot.child(req).child("people").child(x).child("customerSSN").val()
		if(testSSN === null)
			break;
	testSSN = testSSN.substring(testSSN.length-4,testSSN.length);
		console.log('testSSN '+testSSN+', lastSSN '+ lastSSN);
		if(testSSN === lastSSN.toString())
		{
			assistant.ask('I see that ' +snapshot.child(req).child("people").child(x).child("firstName").val() + ' '+ snapshot.child(req).child("people").child(x).child("lastName").val()+'\'s phone number is '+ snapshot.child(req).child("people").child(x).child("contactPhone").val());
			testSSN = 'End';
			break;
		}

	}
	if(testSSN !== "End")
	assistant.ask('Sorry, I could not find anyone with that information');
	});
}

//Finds ssn, given account number and last 4 of social
function ssnFind(assistant){
var req = request.body.result.parameters.acctNum;
	var lastSSN = request.body.result.parameters.ssn;
	var testSSN;
	ref.on("child_added",function(snapshot) {
	for(var x = 0; x < maxPeoplePerAccount;x++)
	{
		testSSN = snapshot.child(req).child("people").child(x).child("customerSSN").val()
		if(testSSN === null)
			break;
	testSSN = testSSN.substring(testSSN.length-4,testSSN.length);
		console.log('testSSN '+testSSN+', lastSSN '+ lastSSN);
		if(testSSN === lastSSN.toString())
		{
			assistant.ask('I see that ' +snapshot.child(req).child("people").child(x).child("firstName").val() + ' '+ snapshot.child(req).child("people").child(x).child("lastName").val()+'\'s SSN is '+ snapshot.child(req).child("people").child(x).child("customerSSN").val());
			testSSN = 'End';
			break;
		}

	}
	if(testSSN !== "End")
	assistant.ask('Sorry, I could not find anyone with that information');
	});
}

//Finds email, given account number and last 4 of social
function emailFind(assistant){
var req = request.body.result.parameters.acctNum;
	var lastSSN = request.body.result.parameters.ssn;
	var testSSN;
	ref.on("child_added",function(snapshot) {
	for(var x = 0; x < maxPeoplePerAccount;x++)
	{
		testSSN = snapshot.child(req).child("people").child(x).child("customerSSN").val()
		if(testSSN === null)
			break;
	testSSN = testSSN.substring(testSSN.length-4,testSSN.length);
		console.log('testSSN '+testSSN+', lastSSN '+ lastSSN);
		if(testSSN === lastSSN.toString())
		{
			assistant.ask('I see that ' +snapshot.child(req).child("people").child(x).child("firstName").val() + ' '+ snapshot.child(req).child("people").child(x).child("lastName").val()+'\'s email is '+ snapshot.child(req).child("people").child(x).child("email").val());
			testSSN = 'End';
			break;
		}

	}
	if(testSSN !== "End")
	assistant.ask('Sorry, I could not find anyone with that information');
	});
}

//Finds role, given account number and last 4 of social
function roleFind(assistant){
var req = request.body.result.parameters.acctNum;
	var lastSSN = request.body.result.parameters.ssn;
	var testSSN;
	ref.on("child_added",function(snapshot) {
	for(var x = 0; x < maxPeoplePerAccount;x++)
	{
		testSSN = snapshot.child(req).child("people").child(x).child("customerSSN").val()
		if(testSSN === null)
			break;
	testSSN = testSSN.substring(testSSN.length-4,testSSN.length);
		console.log('testSSN '+testSSN+', lastSSN '+ lastSSN);
		if(testSSN === lastSSN.toString())
		{
			assistant.ask('I see that ' +snapshot.child(req).child("people").child(x).child("firstName").val() + ' '+ snapshot.child(req).child("people").child(x).child("lastName").val()+' is a '+ snapshot.child(req).child("people").child(x).child("role").val());
			testSSN = 'End';
			break;
		}

	}
	if(testSSN !== "End")
	assistant.ask('Sorry, I could not find anyone with that information');
	});
}

//Updates cashValue using account number and value from user
function cashValueUpdate(assistant){
	var req = request.body.result.parameters.acctNum;
	var newVal = request.body.result.parameters.cashVal;
	db.ref("transamerica-dummy-data/accounts/"+req).update({cashValue: newVal});
	assistant.ask('Done!');

}
//Updates coverage phase using account number and value from user
function coveragePhaseUpdate(assistant){
	var req = request.body.result.parameters.acctNum;
	var newVal = request.body.result.parameters.coverPhase;
	db.ref("transamerica-dummy-data/accounts/"+req).update({coveragePhase: newVal});
	assistant.ask('Done!');
}
//Updates initial premium using account number and value from user
function initialPremiumUpdate(assistant){
	var req = request.body.result.parameters.acctNum;
	var newVal = request.body.result.parameters.initPrem;
	db.ref("transamerica-dummy-data/accounts/"+req).update({initialPremium: newVal});
	assistant.ask('Done!');
}
//Updates issue date using account number and value from user
function issueDateUpdate(assistant){
	var req = request.body.result.parameters.acctNum;
	var newVal = request.body.result.parameters.issDate;
	db.ref("transamerica-dummy-data/accounts/"+req).update({issueDate: newVal});
	assistant.ask('Done!');
}
//Updates payout value using account number and value from user
function payoutValueUpdate(assistant){
	var req = request.body.result.parameters.acctNum;
	var newVal = request.body.result.parameters.payoutVal;
	db.ref("transamerica-dummy-data/accounts/"+req).update({payoutValue: newVal});
	assistant.ask('Done!');
}
//Updates policy number using account number and value from user
function policyNumberUpdate(assistant){
	var req = request.body.result.parameters.acctNum;
	var newVal = request.body.result.parameters.policyNum;
	db.ref("transamerica-dummy-data/accounts/"+req).update({policyNum: newVal});
	assistant.ask('Done!');
}
//Updates product name using account number and value from user
function productNameUpdate(assistant){
	var req = request.body.result.parameters.acctNum;
	var newVal = request.body.result.parameters.proName;
	db.ref("transamerica-dummy-data/accounts/"+req).update({productName: newVal});
	assistant.ask('Done!');
}
//Updates product type using account number and value from user
function productTypeUpdate(assistant){
	var req = request.body.result.parameters.acctNum;
	var newVal = request.body.result.parameters.proType;
	db.ref("transamerica-dummy-data/accounts/"+req).update({productType: newVal});
	assistant.ask('Done!');
}
//Updates status using account number and value from user
function statusUpdate(assistant){
	var req = request.body.result.parameters.acctNum;
	var newVal = request.body.result.parameters.stat;
	db.ref("transamerica-dummy-data/accounts/"+req).update({status: newVal});
	assistant.ask('Done!');
}
//Updates termination date using account number and value from user
function terminationDateUpdate(assistant){
	var req = request.body.result.parameters.acctNum;
	var newVal = request.body.result.parameters.termDate;
	db.ref("transamerica-dummy-data/accounts/"+req).update({terminationDate: newVal});
	assistant.ask('Done!');
}
//Updates DOB using account number, last 4 of ssn and value from user
function DOBUpdate(assistant){
	var req = request.body.result.parameters.acctNum;
	var lastSSN = request.body.result.parameters.ssn;
	var newVal = request.body.result.parameters.dob;
	var testSSN;
	ref.on("child_added",function(snapshot) {
	for(var x = 0; x < maxPeoplePerAccount;x++)
	{
		testSSN = snapshot.child(req).child("people").child(x).child("customerSSN").val()
		if(testSSN === null)
			break;
	testSSN = testSSN.substring(testSSN.length-4,testSSN.length);
		//console.log('testSSN '+testSSN+', lastSSN '+ lastSSN);
		if(testSSN === lastSSN.toString())
		{
	db.ref("transamerica-dummy-data/accounts/"+req+"/people/"+x).update({DateOfBirth: newVal});
			testSSN = 'End';
			break;
		}

	}
	if(testSSN !== "End")
	assistant.ask('Sorry, I could not find anyone with that information');
	else
	assistant.ask('Done!');
	});
}
//Updates gender using account number, last 4 of ssn and value from user
function genderUpdate(assistant){
var req = request.body.result.parameters.acctNum;
	var lastSSN = request.body.result.parameters.ssn;
	var newVal = request.body.result.parameters.gender;
	var testSSN;
	ref.on("child_added",function(snapshot) {
	for(var x = 0; x < maxPeoplePerAccount;x++)
	{
		testSSN = snapshot.child(req).child("people").child(x).child("customerSSN").val()
		if(testSSN === null)
			break;
	testSSN = testSSN.substring(testSSN.length-4,testSSN.length);
		//console.log('testSSN '+testSSN+', lastSSN '+ lastSSN);
		if(testSSN === lastSSN.toString())
		{
	db.ref("transamerica-dummy-data/accounts/"+req+"/people/"+x).update({Gender: newVal});
			testSSN = 'End';
			break;
		}

	}
	if(testSSN !== "End")
	assistant.ask('Sorry, I could not find anyone with that information');
	else
	assistant.ask('Done!');
	});
}
//Updates phone number using account number, last 4 of ssn and value from user
function phoneUpdate(assistant){
var req = request.body.result.parameters.acctNum;
	var lastSSN = request.body.result.parameters.ssn;
	var newVal = request.body.result.parameters.phone;
	var testSSN;
	ref.on("child_added",function(snapshot) {
	for(var x = 0; x < maxPeoplePerAccount;x++)
	{
		testSSN = snapshot.child(req).child("people").child(x).child("customerSSN").val()
		if(testSSN === null)
			break;
	testSSN = testSSN.substring(testSSN.length-4,testSSN.length);
		//console.log('testSSN '+testSSN+', lastSSN '+ lastSSN);
		if(testSSN === lastSSN.toString())
		{
	db.ref("transamerica-dummy-data/accounts/"+req+"/people/"+x).update({contactPhone: newVal});
			testSSN = 'End';
			break;
		}

	}
	if(testSSN !== "End")
	assistant.ask('Sorry, I could not find anyone with that information');
	else
	assistant.ask('Done!');
	});
}
//Updates ssn using account number, last 4 of ssn and value from user
function ssnUpdate(assistant){
var req = request.body.result.parameters.acctNum;
	var lastSSN = request.body.result.parameters.ssn;
	var newVal = request.body.result.parameters.newssn;
	var testSSN;
	ref.on("child_added",function(snapshot) {
	for(var x = 0; x < maxPeoplePerAccount;x++)
	{
		testSSN = snapshot.child(req).child("people").child(x).child("customerSSN").val()
		if(testSSN === null)
			break;
	testSSN = testSSN.substring(testSSN.length-4,testSSN.length);
		//console.log('testSSN '+testSSN+', lastSSN '+ lastSSN);
		if(testSSN === lastSSN.toString())
		{
	db.ref("transamerica-dummy-data/accounts/"+req+"/people/"+x).update({customerSSN: newVal});
			testSSN = 'End';
			break;
		}

	}
	if(testSSN !== "End")
	assistant.ask('Sorry, I could not find anyone with that information');
	else
	assistant.ask('Done!');
	});
}
//Updates email using account number, last 4 of ssn and value from user
function emailUpdate(assistant){
var req = request.body.result.parameters.acctNum;
	var lastSSN = request.body.result.parameters.ssn;
	var newVal = request.body.result.parameters.email;
	var testSSN;
	ref.on("child_added",function(snapshot) {
	for(var x = 0; x < maxPeoplePerAccount;x++)
	{
		testSSN = snapshot.child(req).child("people").child(x).child("customerSSN").val()
		if(testSSN === null)
			break;
	testSSN = testSSN.substring(testSSN.length-4,testSSN.length);
		//console.log('testSSN '+testSSN+', lastSSN '+ lastSSN);
		if(testSSN === lastSSN.toString())
		{
	db.ref("transamerica-dummy-data/accounts/"+req+"/people/"+x).update({email: newVal});
			testSSN = 'End';
			break;
		}

	}
	if(testSSN !== "End")
	assistant.ask('Sorry, I could not find anyone with that information');
	else
	assistant.ask('Done!');
	});
}
//Updates role using account number, last 4 of ssn and value from user
function roleUpdate(assistant){
var req = request.body.result.parameters.acctNum;
	var lastSSN = request.body.result.parameters.ssn;
	var newVal = request.body.result.parameters.role;
	var testSSN;
	ref.on("child_added",function(snapshot) {
	for(var x = 0; x < maxPeoplePerAccount;x++)
	{
		testSSN = snapshot.child(req).child("people").child(x).child("customerSSN").val()
		if(testSSN === null)
			break;
	testSSN = testSSN.substring(testSSN.length-4,testSSN.length);
		//console.log('testSSN '+testSSN+', lastSSN '+ lastSSN);
		if(testSSN === lastSSN.toString())
		{
	db.ref("transamerica-dummy-data/accounts/"+req+"/people/"+x).update({role: newVal});
			testSSN = 'End';
			break;
		}

	}
	if(testSSN !== "End")
	assistant.ask('Sorry, I could not find anyone with that information');
	else
	assistant.ask('Done!');
	});
}
//Updates address using account number, last 4 of ssn and value from user
function addressUpdate(assistant){
var req = request.body.result.parameters.acctNum;
	var lastSSN = request.body.result.parameters.ssn;
	var newStreet = request.body.result.parameters.addStreet;
	var newZip = request.body.result.parameters.addZip;
	var newCity = request.body.result.parameters.addCity;
	var newState = request.body.result.parameters.addState;
	var newCountry = request.body.result.parameters.addCountry;
	var testSSN;
	ref.on("child_added",function(snapshot) {
	for(var x = 0; x < maxPeoplePerAccount;x++)
	{
		testSSN = snapshot.child(req).child("people").child(x).child("customerSSN").val()
		if(testSSN === null)
			break;
	testSSN = testSSN.substring(testSSN.length-4,testSSN.length);
		//console.log('testSSN '+testSSN+', lastSSN '+ lastSSN);
		if(testSSN === lastSSN.toString())
		{
		db.ref("transamerica-dummy-data/accounts/"+req+"/people/"+x).update({addressStreet: newStreet});
		db.ref("transamerica-dummy-data/accounts/"+req+"/people/"+x).update({addressZip: newZip});
		db.ref("transamerica-dummy-data/accounts/"+req+"/people/"+x).update({addressCity: newCity});
		db.ref("transamerica-dummy-data/accounts/"+req+"/people/"+x).update({addressState: newState});
		db.ref("transamerica-dummy-data/accounts/"+req+"/people/"+x).update({addressCountry: newCountry});
			testSSN = 'End';
			break;
		}

	}
	if(testSSN !== "End")
	assistant.ask('Sorry, I could not find anyone with that information');
	else
	assistant.ask('Done!');
	});
}

function masterFind(assistant){
	var req = request.body.result.parameters.acctNum;
	var lastSSN = request.body.result.parameters.ssn;
	var testSSN;
	ref.on("child_added",function(snapshot) {
	for(var x = 0; x < maxPeoplePerAccount;x++)
	{
		testSSN = snapshot.child(req).child("people").child(x).child("customerSSN").val()
		if(testSSN === null)
			break;
	testSSN = testSSN.substring(testSSN.length-4,testSSN.length);
	console.log('testSSN '+testSSN+', lastSSN '+ lastSSN);
	if(testSSN === lastSSN.toString())
	{
		var fulfilment = {
		contextOut: [
        	{
            "name": "master",
            "lifespan": 99,
            "parameters": {
                "firstName":snapshot.child(req).child("people").child(x).child("firstName").val() ,
                "lastName": snapshot.child(req).child("people").child(x).child("lastName").val() ,
		"DateOfBirth":snapshot.child(req).child("people").child(x).child("DateOfBirth").val() ,
		"Gender":snapshot.child(req).child("people").child(x).child("Gender").val() ,
	"addressCity":snapshot.child(req).child("people").child(x).child("addressCity").val() ,
	"addressCountry":snapshot.child(req).child("people").child(x).child("addressCountry").val() ,
	"addressState":snapshot.child(req).child("people").child(x).child("addressState").val() ,
	"addressStreet":snapshot.child(req).child("people").child(x).child("addressStreet").val() ,
	"addressZip":snapshot.child(req).child("people").child(x).child("addressZip").val() ,
	"contactPhone":snapshot.child(req).child("people").child(x).child("contactPhone").val() ,
	"customerSSN":snapshot.child(req).child("people").child(x).child("customerSSN").val() ,
	"email":snapshot.child(req).child("people").child(x).child("email").val() ,
	"role":snapshot.child(req).child("people").child(x).child("role").val() ,
	"LineOfBusiness":snapshot.child(req).child("LineOfBusiness").val() ,
	"cashValue":snapshot.child(req).child("cashValue").val() ,
	"coveragePhase":snapshot.child(req).child("coveragePhase").val() ,
	"initialPremium":snapshot.child(req).child("initialPremium").val() ,
	"issueDate":snapshot.child(req).child("issueDate").val() ,	
	"payoutValue":snapshot.child(req).child("payoutValue").val() ,
	"policyNum":snapshot.child(req).child("policyNum").val() ,
	"productName":snapshot.child(req).child("productName").val() ,
	"status":snapshot.child(req).child("status").val() ,
	"terminationDate":snapshot.child(req).child("terminationDate").val() ,
        		    }
        		}
    		]
	}//Fulfilment
testSSN = "End";
console.log("response: ", fulfilment);
response.json(fulfilment);
			}
		}
		if(testSSN !== "End")
	assistant.ask('Sorry, I could not find anyone with that information');
	});
}

});
