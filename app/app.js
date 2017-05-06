(function () {
    'use strict';

    // Declare app level module which depends on views, and components
    var app = angular.module('starWarsPlanetarySearch', ['ui.router', 'angular-growl', 'ng-enter']);

    app.config(['growlProvider', function (growlProvider) {
        growlProvider.globalPosition('top-right');
        growlProvider.globalDisableIcons(true);
        growlProvider.globalTimeToLive(5000);
    }]);

    app.constant("SWAPI", "https://swapi.co/api");

    app.value('loggedInUser', {
        id: "",
        _id: "",
        profileName: "",
        loggedIn: false
    });

    app.constant("_", window._);

    app.run(function ($rootScope, $state, auth, growl, loggedInUser) {

        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            if (!auth.isAuthed() && toState.name.indexOf('public')) {
                event.preventDefault();
                $state.go('public.login');
                growl.warning("Please login with an authorized account to access this page")
            }
            if (auth.isAuthed()) {
                loggedInUser.id = auth.returnId();
                loggedInUser._id = auth.returnId();
                loggedInUser.profileName = auth.returnName();
                loggedInUser.loggedIn = true;


                if (!toState.name.indexOf('public.login')) {
                    event.preventDefault();
                    growl.info("You are logged in");
                }
            }
        });
    });
})();
