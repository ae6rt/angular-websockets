var app = angular.module('app', []);

app.controller('controller', function ($scope, websocketService) {
    $scope.msg = "init";

    $scope.update = function (m) {
        $scope.msg = m;
        $scope.$apply();  // update model, driven from outside Angular event cycle
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
                    callback(msg.message);
                };
            }
        }
    }
);