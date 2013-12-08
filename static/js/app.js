var app = angular.module('app', []);

app.controller('controller', function ($scope, websocketService) {
    $scope.msg = "init";
    websocketService.start("ws://localhost:8080/events", $scope);
});

app.factory('websocketService', function () {
        return {
            start: function (url, scope) {
                var websocket = new WebSocket(url);
                websocket.onopen = function () {
                };
                websocket.onclose = function () {
                };
                websocket.onmessage = function (evt) {
                    scope.$apply(function () {
                        scope.msg = JSON.parse(evt.data).message;
                    });
                };
            }
        }
    }
);