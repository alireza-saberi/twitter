"use strict";

// tweeterApp.service 
angular.module('twitterApp.services', []).factory('twitterService', function( $q ) {

    var authorizationResult = false;

    return {
        initialize: function() {
            //initialize OAuth.io with public key of the application
            OAuth.initialize('mcVJ3OV9jALI9Dy2jlzbZHC61qo', {cache:true});
            //try to create an authorization result when the page loads, this means a returning user won't have to click the twitter button again
            authorizationResult = OAuth.create('twitter');
        },
        isReady: function() {
            return ( authorizationResult );
        },
        connectTwitter: function() {
            var deferred = $q.defer();
            OAuth.popup('twitter', {cache:true}, function( error, result ) { //cache means to execute the callback if the tokens are already present
                if ( !error ) {
                    authorizationResult = result;
                    deferred.resolve();
                } else {
                    //do something if there's an error
                    console.log('Error connceting to tweeter!');
                }
            });
            return deferred.promise;
        },
        clearCache: function() {
            OAuth.clearCache('twitter');
            authorizationResult = false;
        },
        getSearchResult: function ( searchString ) {
            var urlEncoded = encodeURIComponent( searchString + ' #iot' );
            var deferred = $q.defer();
            var url = '/1.1/search/tweets.json';
            //  q query: 500 characters maximum, including operators. Queries may additionally be limited by complexity
            url += '?q=' + urlEncoded + '&count=20';

            var promise = authorizationResult.get( url ).done( function( data ) {
                //in case of any error we reject the promise with the error object
                deferred.resolve( data );
            }).fail( function(){
                //in case of any error we reject the promise with the error object
                deferred.reject( err );
            });

            //return the promise of the deferred object
            return deferred.promise;
        }
    }

});


// Container module
var app = angular.module('twitterApp', ['ngSanitize', 'twitterApp.services']);

// contacts for versioning
app.constant( 'version', '1.0' );


// Controllers
app.controller('twitterController', ["$scope", "version", "$log", "twitterService" , "$q", function ( $scope, version, $log, twitterService, $q ) {
    $scope.version = version;
    $scope.hideTable = true;
    $scope.searchbox = {
        str: "",
        hideImage: false
    }
    $scope.tweets = [];
    twitterService.initialize();

    //when the user clicks the connect twitter button, the popup authorization window opens
    $scope.connectButton = function() {
        twitterService.connectTwitter().then( function() {
            if (twitterService.isReady()) {
                //if the authorization is successful, hide the connect button and display the tweets
                $('#connectButton').fadeOut( function() {
                    $('#getTimelineButton, #signOut').fadeIn();
                    $scope.connectedTwitter = true;
                });
            } else {

            }
        });
    }

    //sign out clears the OAuth cache, the user will have to reauthenticate when returning
    $scope.signOut = function() {
        twitterService.clearCache();
        $scope.tweets.length = 0;
        $('#getTimelineButton, #signOut').fadeOut( function() {
            $('#connectButton').fadeIn();
            $scope.$apply( function() {
                $scope.connectedTwitter = false
            })
        });
    }

    //if the user is a returning user, hide the sign in button and display the tweets
    if (twitterService.isReady()) {
        $('#connectButton').hide();
        $('#getTimelineButton, #signOut').show();
        $scope.connectedTwitter = true;
    }


    $scope.search = function( searchString ) {

        twitterService.getSearchResult( searchString ).then( function( data ) {
            // console.log( data );
            // console.log( "compeleted in " data.search_metadata.completed_in );
            $scope.timer = data.search_metadata.completed_in;
            // console.log( 'compeleted in : ' + data.search_metadata.completed_in );
            console.log( data.statuses );
            var trimmed_tweets = new Array();
            for ( var i = 0; i < data.statuses.length; i++ ) {
                if ( data.statuses[i].entities.hasOwnProperty('media') ){
                    // console.log( data.statuses[i].entities.media[0].media_url );
                    var tweet = {
                        text : data.statuses[i].text,
                        image: data.statuses[i].entities.media[0].media_url
                    };
                    trimmed_tweets.push( tweet );
                } else {
                    // console.log("No media image for this tweet!");
                    var tweet = {
                        text: data.statuses[i].text,
                        image: "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                    }
                     trimmed_tweets.push( tweet );
                }
            }
            // console.log( trimmed_tweets );
            // $scope.tweets = new Array(); //array of tweets
            $scope.tweets =  trimmed_tweets ;
            if ( trimmed_tweets.length > 0) {
                $scope.hideTable = false;
            }
        })

    };
}]);

