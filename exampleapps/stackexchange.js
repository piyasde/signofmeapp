var stackexchange = require('stackexchange');

var options = { version: 2.2 };
var context = new stackexchange(options);

var filter = {
  key: '',
  pagesize: 50,
  tagged: 'java-ee',
  sort: 'activity',
  order: 'asc'
};

var filteruser = {
  key: ''
};


// Get all the questions (http://api.stackexchange.com/docs/questions)

var user = new Array("1064374");

context.users.userdetails(filteruser,user, function(err, results){
  if (err) throw err;

  console.log(results);
});


/*
context.users.answers(filter,user, function(err, results){
  if (err) throw err;

  console.log(results);
});
*/
/*

context.questions.questions(filter, function(err, results){
  if (err) throw err;

  console.log(results.items.length);
});

*/
