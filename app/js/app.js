"use strict";
// Container module
var app = angular.module('twitterApp', []);

// Controllers
app.controller('twitterController', function ($scope) {
    $scope.hideTable = true;
    $scope.searchbox = {
    	str: "",
    	hideImage: false
    }
    $scope.tweets = new Array(); 

    $scope.search = function( searchString) {
    	$scope.hideTable = false;
    	$scope.tweets = [
            {message: 'tweet1', img:'img1'}, 
            {message: 'tweet2', img:'img2'},
            {message: 'tweet3', img:'img3'}, 
            {message: 'tweet4', img:'img4'}
        ];
    };
});

// facotried
