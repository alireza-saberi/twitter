"use strict";
// Container module
var app = angular.module('twitterApp', []);

// contacts for versioning
app.constant( 'version', '1.0' );

// factories
app.factory("twitter", ["$http", function( $http ) {
    var twts = {};
    twts.getTweets = function( searchString ){
        var urlEncoded = encodeURIComponent( searchString + ' #iot' );
        console.log(urlEncoded);
        return $http.get( '/twitter', urlEncoded );
    }
    return twts;
}]);

// Controllers
app.controller('twitterController', ["$scope", "twitter", "version", "$log",  function ( $scope, twitter, version, $log ) {
    $scope.version = version;
    $scope.hideTable = true;
    $scope.searchbox = {
    	str: "",
    	hideImage: false
    }
    $scope.tweets = new Array(); 

    $scope.search = function( searchString ) {
    	$scope.hideTable = false;

        // Asynchronous call to twitter 
        twitter.getTweets( searchString ).success( function( tweets ){
            $scope.tweets = tweets;

        } ).error( function( data, status, header, config ){
            $log.log("error talking with twitter!");
        });
    };
}]);

