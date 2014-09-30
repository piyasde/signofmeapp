var app = angular.module("SignofmeApp", ["ngRoute"]);

app.config(function($routeProvider){
	$routeProvider
		.when("/editprofile", {
			templateUrl: "public/myprofilebody.html"
		})
		//.when("/", {
		//	templateUrl: "viewmyprofileinnerbody.ejs"
		//})
		.when("/viewprofile", {
			templateUrl: "viewmyprofileinnerbody.ejs"
		})
		.when("/postsubmit", {
			templateUrl: "public/mypostsubmitbody.html"
		})
		.when("/myposts", {
			templateUrl: "public/myprofilepostbody.html"
		})
		.when("/myfriends", {
			templateUrl: "public/myprofilefriendbody.html"
		})	
		.when("/myconversations", {
			templateUrl: "public/myprofileconversationbody.html"
		})	
		.when("/postsearch", {
			templateUrl: "public/myprofilepostsearchbody.html"
		})
		.when("/invitation", {
			templateUrl: "public/myprofileacceptinvitebody.html"
		})
		.otherwise({
			redirectTo: "/"
		});
});

function TotalCtrl($scope) {
	$scope.city = 'Kolkata 1';

}
