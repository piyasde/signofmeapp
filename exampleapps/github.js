var GitHubApi = require("github");

var github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
    //debug: true,
    //protocol: "https",
    //host: "github.my-GHE-enabled-company.com",
    //pathPrefix: "/api/v3", // for some GHEs
    timeout: 5000
});
/*
github.repos.get({
    // optional:
    // headers: {
    //     "cookie": "blahblah"
    // },
    user: "piyasde",
    repo : "signofmeapp"
}, function(err, res) {
    console.log(JSON.stringify(res.name));
});
*/
/*
github.repos.getFromUser({
    user: "piyasde"
}, function(err, res) {
    var i = 0;
    while(i<res.length)
	{		
    		console.log(res[i].name);
		i++;
	}
	//for(i=0;i<res.length;i++)
	//{
    	//	console.log(res[i].name);
	//}
});
*/

github.user.getFrom(
            {
                user: "piyasde"
            },
            function(err, res) {
                //Assert.equal(err, null);
                // other assertions go here
                //next();
		console.log(res);
            }
        );
