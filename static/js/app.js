var app = angular.module('app', []);

app.controller('controller', function ($scope, websocketService) {
    $scope.msg = "init";

    $scope.update = function (m) {
        console.log("callback with message: " + m);
        $scope.msg = m;
    };

    websocketService.start("ws://localhost:8080/events", $scope.update);

});

app.factory('websocketService', function () {
        return {
            start: function (url, callback) {
                var websocket = new WebSocket(url);
                websocket.onopen = function () {
                };
                websocket.onclose = function () {
                };
                websocket.onmessage = function (evt) {
                    var msg = JSON.parse(evt.data);
                    console.log("received message: " + msg.message);
                    callback(msg.message);
                };
            }
        }
    }
);