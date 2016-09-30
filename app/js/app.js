"use strict";
// Container module
var app = angular.module('twitterApp', []);

// contacts for versioning
app.constant( 'version', '1.0' );

// factories
app.factory("twitter", ["$http", function( $http ) {
    var twts = {};
    twts.getTweets = function( searchString ){
        // return $http.get('/condidateslist');
        return [
            {message: 'tweet1', img:'img1'}, 
            {message: 'tweet2', img:'img2'},
            {message: 'tweet3', img:'img3'}, 
            {message: 'tweet4', img:'img4'}
        ];
    }
    return twts;
}]);

// Controllers
app.controller('twitterController', ["$scope", "twitter", "version",  function ( $scope, twitter, version ) {
    $scope.version = version;
    $scope.hideTable = true;
    $scope.searchbox = {
    	str: "",
    	hideImage: false
    }
    $scope.tweets = new Array(); 

    $scope.search = function( searchString ) {
    	$scope.hideTable = false;
        $scope.tweets = twitter.getTweets( searchString );
    };
}]);

