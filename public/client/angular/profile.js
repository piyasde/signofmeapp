var app = angular.module("SignofmeAppProfile", ["ngRoute"]);

function TotalCtrl($scope, $window,$http) {
	console.log($window.aboutme);
	$scope.user = {};
	$scope.user.name = $window.nameuser;
	$scope.user.email = $window.email;	
        $scope.user.city = $window.city;
        $scope.user.state = $window.state;
        $scope.user.country = $window.country;
        $scope.user.aboutme = $window.aboutme;
        $scope.user.work = $window.work;
        $scope.user.skill = $window.skill;
        $scope.user.education = $window.education;
        $scope.user.project = $window.project;
       	console.log($scope.user.aboutme);
	
	$scope.updateProfile = function() {
		//console.log('This is controller calling');
		//console.log($scope.user.name);
		//console.log($scope.user.email);
		//console.log($scope.user.aboutme);
		$http({
			    url: '/updateuserdata',
			    method: "POST",
			    data: { 'edituser' : $scope.user }
			})
			.then(function(response) {
	        		// success
				var returnJson = response;
				console.log(returnJson.data);
				console.log(returnJson.data.name);
				//console.log('success response -->>'+  returnJson.name);
				$scope.updateMessage = "Hi " + returnJson.data.name + ", your profile is perfectly updated...";
				$scope.user.name = returnJson.data.name;
	    		}, 
	    		function(response) { // optional
	        		// failed
				console.log('failure response -->>'+ response);
	    		}
		);

	    }
	}



