(function () {
    'use strict';

    var app = angular.module('starWarsPlanetarySearch');

    app.controller('SWPSController', ['$state', '$scope', '$rootScope', function ($state, $scope, $rootScope) {
        this.$state = $state;
    }]);

    app.controller('PublicController', ['$scope', function ($scope) {

    }]);

    app.controller('LoginController', ['$state', '$scope', '$rootScope', '$timeout', 'growl', 'user', 'auth', 'loggedInUser', '$window',
        function ($state, $scope, $rootScope, $timeout, growl, user, auth, loggedInUser, $window) {

            var colors = ["#BB0009", "#0088E2"];

            function setBackground(colors) {
                // generates a random integer between 0 and the length of the supplied array:
                var n = Math.floor(Math.random() * colors.length);

                // sets the background-image of the 'body' element:
                var element = document.getElementById('login');

                if(element) {
                    document.getElementById('login').style.background = colors[n];
                    document.getElementById('login').style.borderColor = colors[n];
                }
            }

            setBackground(colors);

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
                                if(user.birth_year === $scope.password && user.name.toLowerCase() === $scope.username.toLowerCase()) {
                                    loggedInUser.profileName = user.name;
                                    $window.localStorage['loggedInUser'] = JSON.stringify(loggedInUser);
                                    $window.localStorage['counter'] = 15;
                                    return true;
                                }
                                return false;
                            });
                            if(validated) {
                                growl.success("You are now logged in.");
                                $state.go('user');
                            } else {
                                growl.error("Invalid Username. Please check!");
                            }
                        } else {
                            var user = users[0];
                            loggedInUser.profileName = user.name;
                            $window.localStorage['loggedInUser'] = JSON.stringify(loggedInUser);
                            $window.localStorage['counter'] = 15;
                            if (user.birth_year === $scope.password && user.name.toLowerCase() === $scope.username.toLowerCase()) {
                                growl.success("You are now logged in.");
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

    app.controller('SearchController', ['$state', '$scope', 'PlanetService', 'growl', 'auth', '$window', '$timeout', function ($state, $scope, PlanetService, growl, auth, $window, $timeout) {
        $scope.planetsFound = false;
        $scope.planetName = "";
        $scope.planets = [];
        $scope.previousPage = "";
        $scope.nextPage = "";

        $timeout(function () {
            $window.localStorage.counter = 15;
        }, 60000);

        var loggedInUser = JSON.parse(auth.getLoggedInUser());
        var counter = parseInt($window.localStorage.counter);

        $scope.getPlanets = function () {
            if(loggedInUser.profileName !== 'Luke Skywalker' && counter !== 0) {
                counter--;
                $window.localStorage.counter = counter;
            }

            if($scope.planetName === "") {
                $scope.planets = [];
                $scope.planetsFound = false;
                $scope.previousPage = "";
                $scope.nextPage = "";
            } else {
                if(counter > 0) {
                    PlanetService.findPlanets($scope.planetName).then(function (response) {
                        if(response.results.length === 0) {
                            $scope.planetsFound = false;
                            $scope.planets = [];
                        } else {
                            $scope.planetsFound = true;
                            $scope.planets = response.results;

                            $scope.planets = _.sortBy($scope.planets, function (planet) {
                                return planet.population.length;
                            });

                            _.each($scope.planets, function (planet) {
                                planet.smallPlanet = false;
                                planet.mediumPlanet = false;
                                planet.largePlanet = false;

                                if(planet.population === "unknown" || (planet.population.length > 1 && planet.population.length <= 6)) {
                                    planet.smallPlanet = true;
                                }

                                if(planet.population !== "unknown" && planet.population.length > 6 && planet.population.length <= 7) {
                                    planet.mediumPlanet = true;
                                }

                                if(planet.population !== "unknown" && planet.population.length > 7) {
                                    planet.largePlanet = true;
                                }
                            });

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
                } else {
                    growl.info("You have exceeded the maximum number of attempts at this time. Please wait 1 minute");
                }
            }
        };

        $scope.getMorePlanets = function (type) {
            if(loggedInUser.profileName !== 'Luke Skywalker' && counter !== 0) {
                counter--;
                $window.localStorage.counter = counter;
            }


            var url = "";
            if(type === 'next') {
                url = $scope.nextPage;
            } else {
                url = $scope.previousPage;
            }
            if(counter > 0) {
                PlanetService.pageFilter(url).then(function (response) {
                    if(response.results.length === 0) {
                        $scope.planetsFound = false;
                        $scope.planets = [];
                    } else {
                        $scope.planetsFound = true;
                        $scope.planets = response.results;

                        $scope.planets = _.sortBy($scope.planets, function (planet) {
                            return planet.population.length;
                        });

                        _.each($scope.planets, function (planet) {
                            planet.smallPlanet = false;
                            planet.mediumPlanet = false;
                            planet.largePlanet = false;

                            if(planet.population === "unknown" || (planet.population.length >= 1 && planet.population.length <= 6)) {
                                planet.smallPlanet = true;
                            }

                            if(planet.population !== "unknown" && planet.population.length > 6 && planet.population.length <= 7) {
                                planet.mediumPlanet = true;
                            }

                            if(planet.population !== "unknown" && planet.population.length > 7) {
                                planet.largePlanet = true;
                            }
                        })

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
            } else {
                growl.info("You have exceeded the maximum number of attempts at this time. Please wait 1 minute");
            }
        };

        $scope.logout = function () {
            auth.logout();
            $state.reload();
        };
    }]);

})();
