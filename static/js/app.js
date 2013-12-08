var app = angular.module('app', []);

app.controller('controller', function ($scope) {
    $scope.msg = "init";

    var ws = new WebSocket("ws://localhost:8080/events");

    ws.onopen = function () {
    };
    ws.onclose = function () {
    };
    ws.onmessage = function (evt) {
        var msg = JSON.parse(evt.data);
        $scope.msg = msg.message;
        console.log(msg.message);
    };
});