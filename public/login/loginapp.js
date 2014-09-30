var validationApp = angular.module('validationLoginApp', []);

// create angular controller
validationApp.controller('loginController', function($scope) {

	// function to submit the form after all validation has occurred			
	$scope.submitForm = function(isValid) {
		// check to make sure the form is completely valid
		if (isValid) { 
			alert('our form is valid');
		}

	};

});
