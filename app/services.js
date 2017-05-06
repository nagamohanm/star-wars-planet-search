(function () {
    'use strict';

    var app = angular.module('starWarsPlanetarySearch');

    app.service('auth', ['$window', '$location', function ($window) {


        var self = this;

        self.getLoggedInUser = function () {
            return $window.localStorage.loggedInUser;
        };

        self.isAuthed = function () {
            var token = self.getLoggedInUser();
            if (token) {
                return token.profileName !== "" ? true : false;
            } else {
                return false;
            }
        };

        self.logout = function () {
            $window.localStorage.removeItem('sessionToken');
            $window.localStorage.removeItem('dataForLocalUsage');
            $window.localStorage.removeItem('loggedInUser');
            $window.location.reload();
        };


    }]);

    app.service('user', ['$http', '$q', 'SWAPI', '$state', function($http, $q, SWAPI, $state) {
        var self = this;

        self.login = function (username) {
            var deferred = $q.defer();
            $http.get(SWAPI + "/people",
                {
                    params: { search: username }
                }
            ).then(function (result) {
                deferred.resolve(result.data);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };
    }]);

    app.service('PlanetService', ['$http', '$q', 'SWAPI', '$state', function($http, $q, SWAPI, $state) {
        var self = this;

        self.findPlanets = function (planetName) {
            var deferred = $q.defer();
            $http.get(SWAPI + "/planets",
                {
                    params: { search: planetName }
                }
            ).then(function (result) {
                deferred.resolve(result.data);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        self.pageFilter = function (url) {
            var deferred = $q.defer();
            $http.get(url).then(function (result) {
                deferred.resolve(result.data);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };
    }]);
})();