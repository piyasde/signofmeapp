var Twit = require('twit')

var T = new Twit({
    consumer_key:         ''
  , consumer_secret:      ''
  , access_token:         ''
  , access_token_secret:  ''
})

//
//  get the list of user id's that follow @tolga_tezel
//
/*
T.get('followers/ids', { screen_name: 'phloxblog' },  function (err, data, response) {
  console.log(data)
})
*/
T.get('users/show', { screen_name: 'phloxblog' },  function (err, data, response) {
  console.log(data)
})

