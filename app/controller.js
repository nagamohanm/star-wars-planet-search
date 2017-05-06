(function () {
    'use strict';

    var app = angular.module('starWarsPlanetarySearch');

    app.controller('SWPSController', ['$state', '$scope', '$rootScope', function ($state, $scope, $rootScope) {
        this.$state = $state;
    }]);

    app.controller('PublicController', ['$scope', function ($scope) {

    }]);

    app.controller('LoginController', ['$state', '$scope', '$rootScope', '$timeout', 'growl', 'user', 'auth',
        function ($state, $scope, $rootScope, $timeout, growl, user, auth) {

            var colors = ["#BB0009", "#0088E2"];

            function setBackground(colors) {
                // generates a random integer between 0 and the length of the supplied array:
                var n = Math.floor(Math.random() * colors.length);

                // sets the background-image of the 'body' element:
                document.getElementById('login').style.background = colors[n];
                document.getElementById('login').style.borderColor = colors[n];
            }

            setBackground(colors);
            window.setInterval(function(){
                setBackground(colors);
            }, 2000);

            $rootScope.$emit('auth');
            $scope.isAuthed = auth.isAuthed();

            $scope.username = "";
            $scope.password = "";

            $scope.authenticateUser = function () {
                var users = [];
                user.login($scope.username).then(function (response) {
                    if(response.results.length === 0) {
                        growl.error("Invalid Username. Please check!");
                    } else {
                        users = response.results;
                        if(users.length > 1) {
                            var validated = _.some(users, function (user) {
                                return user.birth_year === $scope.password && user.name.toLowerCase() === $scope.username.toLowerCase();
                            });
                            if(validated) {
                                growl.success("Success");
                                $state.go('user');
                            } else {
                                growl.error("Failure");
                            }
                        } else {
                            var user = users[0];
                            if (user.birth_year === $scope.password && user.name.toLowerCase() === $scope.username.toLowerCase()) {
                                growl.success("Success");
                                $state.go('user');
                            }
                        }
                    }
                });
            };

            $scope.logout = function () {
                auth.logout();
                $state.reload();
            };
        }]);

    app.controller('SearchController', ['$scope', 'PlanetService', 'growl', function ($scope, PlanetService, growl) {
        $scope.planetsFound = false;
        $scope.planetName = "";
        $scope.planets = [];
        $scope.previousPage = "";
        $scope.nextPage = "";

        $scope.getPlanets = function () {
            PlanetService.findPlanets($scope.planetName).then(function (response) {
                if(response.results.length === 0) {
                    $scope.planetsFound = false;
                } else {
                    $scope.planetsFound = true;
                    $scope.planets = response.results;

                    if(response.previous !== null) {
                        $scope.previousPage = response.previous;
                    } else {
                        $scope.previousPage = "";
                    }

                    if(response.next !== null) {
                        $scope.nextPage = response.next;
                    } else {
                        $scope.nextPage = "";
                    }
                }
            });
        };

        $scope.getMorePlanets = function (type) {
            var url = "";
            if(type === 'next') {
                url = $scope.nextPage;
            } else {
                url = $scope.previousPage;
            }
            PlanetService.pageFilter(url).then(function (response) {
                if(response.results.length === 0) {
                    $scope.planetsFound = false;
                } else {
                    $scope.planetsFound = true;
                    $scope.planets = response.results;

                    if(response.previous !== null) {
                        $scope.previousPage = response.previous;
                    } else {
                        $scope.previousPage = "";
                    }

                    if(response.next !== null) {
                        $scope.nextPage = response.next;
                    } else {
                        $scope.nextPage = "";
                    }
                }
            })
        };
    }]);

})();