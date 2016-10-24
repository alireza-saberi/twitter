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
            url += '?q=' + urlEncoded + '&count=100';

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
    };

});