
var http = require('http'); // Required node http module to make the get method call

var mergeQuery = 'MERGE (user:SignofmeUser { email:{inputemail},entitytype:{inputentitype}}) ON MATCH SET user.name = {inputname} RETURN user;';


var optionsget = {
    host : 'localhost',            // Neo4j Server Host name
    port : 7474,                   // Neo4j Server port 
    path : '/db/data/node/1',      // specific query to the server
    method : 'GET'                 // method for the query
};

/*
Example Request -

POST http://localhost:7474/db/data/cypher
Accept: application/json; charset=UTF-8
Content-Type: application/json
{
  "query" : "MATCH (x {name: 'I'})-[r]->(n) RETURN type(r), n.name, n.age",
  "params" : {
  }
}

*/

console.info('Options prepared:');
console.info(optionsget);
console.info('Do the GET call');

var reqGet = http.get(optionsget, function(res) {   // The get method call
    console.log("statusCode: ", res.statusCode);

    buffer='';

    res.on('data', function(d) {   // gathering data while receiving it in response data emit through 
        buffer += d.toString();    // callback
    });

    res.on('end', function() {     // On end of getting data from response callback, parsed it to JSON object        console.info('GET result:\n');
        jsonData = JSON.parse(buffer);
        console.log(jsonData.data);
        console.info('\n\nResult completed');
    });

});
reqGet.on('error', function(e) {
    console.error(e);
});

reqGet.end();  // End of the request
