var config = require('./dataconfig/config');
var neo4j = require('neo4j-js');
var neo = require('./neoquery');

var util = require('../utilpackages/util');

var neo4jurl = process.env.NEO4J_URL ;
neo4jurl = neo4jurl +'/db/data/';

var optionsAll = {
    host: 'localhost',
    port: 7474,
    path: '/db/data/cypher',
    method: 'POST',
};

var optionsAllTransaction = {
    host: 'localhost',
    port: 7474,
    path: '/db/data/transaction/commit',
    method: 'POST',
};


var insertquery = [ 'CREATE (user:SignofmeUser {entitytype:{inputentitytype}, name : {inputname}, email : {inputemail},pwd :{inputpwd},datetime:timestamp()}) return user;' ];

var insertUserProfileQuery = [ 'CREATE (userProfile:SignofmeUserProfile {entitytype:{inputentitytype}, email : {inputemail},city :{inputcity},state:{inputstate},country:{inputcountry},aboutme:{inputaboutme},work:{inputwork},skill:{inputskill},project:{inputproject},education:{inputeducation},datetime:timestamp()) return userProfile;' ];

var mergeUserQuery =  'MERGE (user:SignofmeUser { email:{inputemail},entitytype:{inputentitytype}}) ON MATCH SET user.name = {inputname} RETURN user;' ;

var query = "MERGE (user:SignofmeUser { email:{inputemail},entitytype:{inputentitytype}}) ON MATCH SET user.name = {inputname} RETURN user";


var createRelUserAndUserProfileQuery =
['MATCH (a:User),(b:userProfile) Where a.entitytype = {inputentitytype} And a.email ={inputemail} And b.email ={inputemail} CREATE (a)-[r1:CREATES{ datetime : timestamp() }]->(b) RETURN a,b;'];


var mergeUserProfileQuery =  
'MERGE (userProfile:SignofmeUserProfile { entitytype :{inputentitytype}, email:{inputemail}}) ';
mergeUserProfileQuery = mergeUserProfileQuery + ' ON CREATE SET userProfile.city = {inputcity}, userProfile.state = {inputstate}, userProfile.country = {inputcountry}, userProfile.aboutme = {inputaboutme}, userProfile.work = {inputwork}, userProfile.skill = {inputskill}, userProfile.project = {inputproject}, userProfile.education = {inputeducation}, userProfile.datetime = timestamp() ';
mergeUserProfileQuery = mergeUserProfileQuery + ' ON MATCH SET userProfile.city ={inputcity},userProfile.state={inputstate},userProfile.country = {inputcountry},userProfile.aboutme={inputaboutme},userProfile.work={inputwork},userProfile.skill={inputskill},userProfile.project={inputproject},userProfile.education={inputeducation},userProfile.updatedatetime=timestamp() RETURN userProfile;';

var mergeUserUserProfileRelation =
'MATCH (user{ entitytype:{inputentitytypeuser}, email:{inputemail}}),(userProfile { entitytype:{inputentitytypeuserprofile}, email:{inputemail}}) MERGE (user)-[r:CREATED]->(userProfile) RETURN r';




var finduserquery = ['MATCH (a) where a.entitytype={inputentitytype} and a.email={inputemail} return a;'];

var finduserprofilequery = ['MATCH (a) where a.entitytype={inputentitytype} and a.email={inputemail} RETURN a;'];


function insertUser(jsonVar, cb) {
   console.log('neo -->>'+jsonVar);	
   var username = jsonVar.name;
   var email = jsonVar.email;
   var password = jsonVar.password;	
   var type = 'signofmeuser';

    console.log('neo1 -->>'+jsonVar);
    neo4j.connect(neo4jurl, function (err, graph) {
			console.log('neo2 -->>'+jsonVar.name);
			console.log('neo2.1 -->>'+neo4jurl);
			console.log('neo2.2 -->>'+graph);

			graph.query(insertquery.join('\n'), {inputname : username,
							     inputentitytype :type,
							     inputemail :email,
							     inputpwd:password} ,function (err, results) {	
				console.log('neo3 -->>'+results);
				if (err) {
					return (err,'Internal Server Error');
				}
				else {
					return cb(null,JSON.stringify(results));
				}
			});	
	});
}

function insertOrUpdateUserRelationShip(jsonVar, cb) {
    console.log('neo -->>'+jsonVar);	
    var email = util.checkBlankValue(jsonVar.email);
    var userprofile = 'signofmeuserprofile';
    var user = 'signofmeuser';
    console.log('neo3333 -->>'+JSON.stringify(jsonVar));

			neo.genericTransactionWithParams(mergeUserUserProfileRelation, {
							     inputemail :email,
							     inputentitytypeuserprofile:userprofile,		
							     inputentitytypeuser:user		
								} ,optionsAllTransaction, function (err,status,data) {
				console.log('neo3 -->>'+data);
				if (status!==200) {
					return (err,'Internal Server Error');
				}
				else {
					return cb(null,JSON.stringify(data));
				}
			});
}



function insertOrUpdateUserProfile(jsonVar, cb) {
    console.log('neo 1234-->>'+jsonVar);	
    var email = util.checkBlankValue(jsonVar.email);
    var city = util.checkBlankValue(jsonVar.city);
    var state = util.checkBlankValue(jsonVar.state);
    var country = util.checkBlankValue(jsonVar.country);   
    var aboutme = util.checkBlankValue(jsonVar.aboutme);   
    var work = util.checkBlankValue(jsonVar.work);
    var skill = util.checkBlankValue(jsonVar.skill);
    var project = util.checkBlankValue(jsonVar.project);
    var education = util.checkBlankValue(jsonVar.education);	
    var userprofile = 'signofmeuserprofile';
    console.log('neo2222 -->>'+JSON.stringify(jsonVar));

			neo.genericTransactionWithParams(mergeUserProfileQuery, {
							     inputentitytype:userprofile,		
							     inputemail :email,
							     inputcity:city,
							     inputstate:state,
							     inputcountry:country,
							     inputaboutme:aboutme,
							     inputwork:work,
							     inputskill:skill,
							     inputproject:project,
							     inputeducation:education
								} ,optionsAllTransaction, function (err,status,data) {
				console.log('neo3 -->>'+data);
				if (status!==200) {
					return (err,'Internal Server Error');
				}
				else {
					return cb(null,JSON.stringify(data));
				}
			});

/*
    neo4j.connect(neo4jurl, function (err, graph) {
			util.debugMessage('neo2 -->>'+jsonVar.name);
			util.debugMessage('neo2.1 -->>'+neo4jurl);
			util.debugMessage('neo2.2 -->>'+graph);

			graph.query(insertUserProfilequery.join('\n'), 
                                                            {
							     inputuserprofile:userprofile,		
							     inputemail :email,
							     inputcity:city,
							     inputstate:state,
							     inputcountry:country,
							     inputaboutme:aboutme,
							     inputwork:work,
							     inputskill:skill,
							     inputproject:project,
							     inputeducation:education
								} ,function (err, results) {	
				util.debugMessage('neo3 -->>'+results);
				if (err) {
					util.errorMessage('insertUserProfileError');
					util.errorMessage(err);
					return (err,'Internal Server Error');
				}
				else {
					return cb(null,JSON.stringify(results));
				}
			});	
	});
*/
}



function findUser(username, cb) {
   console.log('neo user -->>'+username);	
   var type = 'signofmeuser';

   neo4j.connect(neo4jurl, function (err, graph) {
			console.log('neo2.1 -->>'+neo4jurl);
			console.log('neo2.2 -->>'+graph);

			graph.query(finduserquery.join('\n'), {
                                                               inputentitytype :type,
							       inputemail : username
                                                              } ,function (err, results) {	
				console.log('neo2 -->>'+results);
				if (err) {
					return (err,'Internal Server Error');
				}
				else {
					return cb(null,JSON.stringify(results));
				}
			});	
	});
}

function findUserProfile(email, cb) {
   util.debugMessage('neo3 -->>'+email);
   var type = 'signofmeuserprofile';

   neo4j.connect(neo4jurl, function (err, graph) {
			util.debugMessage('neo2.1 -->>'+neo4jurl);
			util.debugMessage('neo2.2 -->>'+graph);	
			
			graph.query(finduserprofilequery.join('\n'), {
							   inputentitytype : type,	
                                                           inputemail : email
                                                              } ,function (err, results) {	
				util.debugMessage('neo2 -->>'+results);
				if(results.length == 0)
				{
					console.log(results.length);
					var jsonVar = {};
					jsonVar.city = util.checkBlankValue(jsonVar.city); 
					jsonVar.email = util.checkBlankValue(jsonVar.email);
					jsonVar.state = util.checkBlankValue(jsonVar.state);
					jsonVar.country = util.checkBlankValue(jsonVar.country);   
					jsonVar.aboutme = util.checkBlankValue(jsonVar.aboutme);   
					jsonVar.work = util.checkBlankValue(jsonVar.work);
					jsonVar.skill = util.checkBlankValue(jsonVar.skill);
					jsonVar.project = util.checkBlankValue(jsonVar.project);
					jsonVar.education = util.checkBlankValue(jsonVar.education);	
					results[0] = jsonVar;
				}
				if (err) {
					console.log('1111');
					return (err,'Internal Server Error');
				}
				else {
					console.log('2222');
					return cb(null,JSON.stringify(results));
				}
			});	
	});
}

function updateUser(jsonVar, cb) {
   console.log('neo -->>'+jsonVar);	
   var username = jsonVar.name;
   var email = jsonVar.email;
   var type = 'signofmeuser';

   console.log('neo1 -->>'+jsonVar);
   
			neo.genericTransactionWithParams(mergeUserQuery, {inputemail :email,
								inputentitytype :type,
							     inputname:username} ,optionsAllTransaction, function (err,status,data) {
				console.log('neo3 -->>'+data);
				if (status!==200) {
					return (err,'Internal Server Error');
				}
				else {
					return cb(null,JSON.stringify(data));
				}
			});	
}



module.exports.insertUser = insertUser;
module.exports.findUser = findUser;
module.exports.updateUser = updateUser;
module.exports.insertOrUpdateUserRelationShip = insertOrUpdateUserRelationShip;
module.exports.insertOrUpdateUserProfile = insertOrUpdateUserProfile;
module.exports.findUserProfile = findUserProfile;



