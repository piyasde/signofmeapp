var http = require('http');

var query1 = "MERGE (user:SignofmeUser { email:'piyasde@gmail.com',entitytype:'signofmeuser'}) ON MATCH SET user.name = 'Shyam Das22' RETURN user";

var query = "MERGE (user:SignofmeUser { email:{inputemail},entitytype:{inputentitytype}}) ON MATCH SET user.name = {inputname} RETURN user";


var optionsAllTransaction = {
    host: 'localhost',
    port: 7474,
    path: '/db/data/transaction/commit',
    method: 'POST',
};

var optionsAll = {
    host: 'localhost',
    port: 7474,
    path: '/db/data/cypher',
    method: 'POST',
};

//console.log(data);

function genericQuery(queryStr,params,options, cb) {
	var dataStr = JSON.stringify({
	  "query" : queryStr ,
	  "params" : (params ? params : {})
	});
	var headers= {
	        'Content-Type': 'application/json',
	        'Content-Length': Buffer.byteLength(dataStr)
    	};

	options.headers = headers;
	console.log('queryStr-->>' +queryStr);
	console.log('params-->>' +params);
	console.log('options-->>' +options);
	var req = http.request(options, function(res) {
	    console.log("statusCode: ", res.statusCode);
	
	    res.setEncoding('utf8');
	    res.on('data', function (chunk) {
		console.log("body: " + chunk);
		var chunkStr = chunk;
		var jsonVar = JSON.parse(chunk);
		if(res.statusCode===200)
			{
				return cb(null,res.statusCode,jsonVar.data[0][0].data);
			}
		else
			{
				var err = new Error('Internal Server Error');
				return cb(err,res.statusCode,null);
			} 
	    });
	});

	req.write(dataStr);
	req.end();

}

function genericTransactionWithParams(queryStr,params,options, cb) {
	var dataStr = JSON.stringify({
	  "statements" : [{
	  "statement" : queryStr,
	 "parameters" : params
		    
	}]

	});


	var headers= {
	        'Content-Type': 'application/json',
	        'Content-Length': Buffer.byteLength(dataStr)
    	};

	options.headers = headers;
	console.log('dataStr-->>' +dataStr);
	//console.log('params-->>' +JSON.stringify(params));
	console.log('options-->>' +JSON.stringify(options));
	var req = http.request(options, function(res) {
	    console.log("statusCode: ", res.statusCode);
	
	    res.setEncoding('utf8');
	    var getData ='';	
	    res.on('data', function (chunk) {
		getData = getData + chunk;
		
	    });
	    res.on('end', function () {
		console.log('rrrrr----'+getData);
		var jsonVar = JSON.parse(getData);
		if(res.statusCode===200)
			{
				var err = new Error('Internal Server Error');
				return cb(null,res.statusCode,jsonVar);
			}
		else
			{
				return cb(err,res.statusCode,null);
			} 
	    });	
	    	
	});

	req.write(dataStr);
	req.end();

}


module.exports.genericQuery = genericQuery;
module.exports.genericTransactionWithParams = genericTransactionWithParams;



var params = 
{
    "inputemail" : "piyasde@gmail.com",
    "inputentitytype" : "signofmeuser",
    "inputname" : "Shyam Das Updated"
  }
/*

genericQuery(query, params, optionsAll, function (data,status) {
	console.log("status is -->>"+status);
	console.log("data is -->>"+data.name);
});
*/

/*
genericTransactionWithParams(query,params,optionsAllTransaction, function (err,status,data) {
	console.log("status is -->>"+status);
	console.log("data is -->>"+JSON.stringify(data));
});
*/

