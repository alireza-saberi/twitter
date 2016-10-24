// Controllers
app.controller('twitterController', ["$scope", "version", "$log", "twitterService" , "$q", "$window", function ( $scope, version, $log, twitterService, $q, $window ) {
    $scope.version = version;
    $scope.connectedTwitter = false;
    $scope.hideTable = true;
    $scope.hideMessage = true;
    $scope.searchbox = {
        str: "",
        hideImage: false
    };
    $scope.tweets = [];
    twitterService.initialize();

    //when the user clicks the connect twitter button, the popup authorization window opens
    /**
    * Connect to twitter
    * @author Alireza Saberi
    * @name connectButton
    */
    $scope.connectButton = function() {
        twitterService.connectTwitter().then( function() {
            if (twitterService.isReady()) {
                //if the authorization is successful, hide the connect button and display the tweets
                angular.element($('#connectButton')).addClass("disappear").removeClass("appear");
                angular.element($('#signOut')).addClass("appear").removeClass("disappear");
                $scope.connectedTwitter = true;
                $window.location.reload();
                // $('#connectButton').fadeOut( function() {
                //     $('#getTimelineButton, #signOut').fadeIn();
                //     $scope.connectedTwitter = true;
                //     $window.location.reload();
                // });
            } else {

            }
        });
    };

    //sign out clears the OAuth cache, the user will have to reauthenticate when returning
    /**
    * Disconnect from twitter
    * @author Alireza Saberi
    * @name Signout buttom
    */
    $scope.signOut = function() {
        twitterService.clearCache();
        $scope.tweets.length = 0;
        angular.element($('#connectButton')).addClass("appear").removeClass("disappear");
        angular.element($('#signOut')).addClass("disappear").removeClass("appear");
        $scope.connectedTwitter = false;
        $window.location.reload();
        // $('#getTimelineButton, #signOut').fadeOut( function() {
        //     $('#connectButton').fadeIn();
        //     $scope.$apply( function() {
        //         $scope.connectedTwitter = false;
        //         $window.location.reload();
        //     })
        // });
    };

    //if the user is a returning user, hide the sign in button and display the tweets
    if (twitterService.isReady()) {
        $('#connectButton').hide();
        $('#getTimelineButton, #signOut').show();
        $scope.connectedTwitter = true;
    }
    /**
    * Search in twitter search API over the last week and maximum 100 tweets
    * @author Alireza Saberi
    * @name Search
    */
    $scope.search = function( searchString ) {
        // handling empty search box and connection with twitter
        if ( searchString.length && $scope.connectedTwitter ) {
            twitterService.getSearchResult( searchString ).then( function( data ) {
                // console.log( data );
                // console.log( "compeleted in " data.search_metadata.completed_in );
                $scope.timer = data.search_metadata.completed_in;
                $scope.hideMessage = false;
                // console.log( 'compeleted in : ' + data.search_metadata.completed_in );
                // console.log( data.statuses );
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
                        };
                         trimmed_tweets.push( tweet );
                    }
                }
                // console.log( trimmed_tweets );
                $scope.tweets =  trimmed_tweets ;
                if ( trimmed_tweets.length > 0 ) {
                    $scope.hideTable = false;
                }
                else {
                    $scope.hideTable = true;
                }
        });}
        else {
            console.log("You have to log into yout twitter account and enter something in the searchbox");
        }
    };
}]);
