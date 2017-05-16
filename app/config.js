// =========================================================================
// App Configuration
// =========================================================================

(function () {
    'use strict';

    var app = angular.module('starWarsPlanetarySearch');

    app.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {

        /* Get the root view path */
        var loginViewPath = "/auth/";
        var userViewPath = "/user/";

        $urlRouterProvider.otherwise("/public/login");

        $urlRouterProvider.rule(function ($injector, $location) {

            var path = $location.path();
            var hasTrailingSlash = path[path.length - 1] === '/';

            if (hasTrailingSlash) {

                return path.substr(0, path.length - 1);
            }

        });

        $stateProvider
            .state('public', {
                url: '/public',
                controller: 'PublicController',
                templateUrl: loginViewPath + 'public.html'
            })
            .state('public.login', {
                url: '/login',
                templateUrl: loginViewPath + 'login.html',
                controller: 'LoginController'
            })
            .state('user', {
                url: '/user/planet/search',
                templateUrl: userViewPath + 'search.html',
                controller: 'SearchController'
            });
    }]);

})();