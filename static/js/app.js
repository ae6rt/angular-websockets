var app = angular.module('app', []);

app.controller('controller', function ($scope, $timeout) {
    $scope.msg = "init";

    $scope.setMessage = function (msg) {
        $scope.msg = msg;
    };

    var ws = new WebSocket("ws://localhost:8080/events");
    ws.onopen = function () {
    };
    ws.onmessage = function (evt) {
        var msg = JSON.parse(evt.data);
        console.log(msg.message);
        $scope.setMessage(msg.message);
    };
    ws.onclose = function () {
        console.log("Connection is closed...");
    };
});