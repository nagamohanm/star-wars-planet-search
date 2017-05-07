(function () {
    'use strict';

    // Declare app level module which depends on views, and components
    var app = angular.module('starWarsPlanetarySearch', ['ui.router', 'ui.router.state.events', 'angular-growl', 'ng-enter']);

    app.config(['growlProvider', function (growlProvider) {
        growlProvider.globalPosition('bottom-left');
        growlProvider.globalDisableIcons(true);
        growlProvider.globalTimeToLive(5000);
    }]);

    app.constant("SWAPI", "https://swapi.co/api");

    app.value('loggedInUser', {
        profileName: ""
    });

    app.constant("_", window._);

    app.run(function ($rootScope, $state, auth, growl, loggedInUser) {

        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            if (!auth.isAuthed() && toState.name.indexOf('public')) {
                event.preventDefault();
                $state.transitionTo('public.login');
            }
            if (auth.isAuthed()) {
                if (!toState.name.indexOf('public.login')) {
                    event.preventDefault();
                    growl.info("You are logged in");
                }
            }
        });
    });
})();
