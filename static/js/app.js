var app = angular.module('app', []);

app.controller('controller', function ($scope, websocketService) {
    $scope.msg = "...";

    websocketService.start("ws://localhost:8080/events", function (evt) {
        var obj = JSON.parse(evt.data);
        $scope.$apply(function () {
            $scope.msg = obj.message
        });
    });
});

app.factory('websocketService', function () {
        var websocket;
        return {
            start: function (url, callback) {
                websocket = new WebSocket(url);
                websocket.onopen = function () {
                };
                websocket.onclose = function () {
                };
                websocket.onmessage = function (evt) {
                    callback(evt);
                };
            },
            stop: function () {
                websocket.close();
            }
        }
    }
);