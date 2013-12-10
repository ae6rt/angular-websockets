var services = angular.module('services', []);

services.factory("t", function () {
    var someVar = "foo";
    return {
        start: function () {
            console.log("t started with someVar=" + someVar);
        }
    }
});

services.factory("u", function () {
    var someVar = "bar";
    return {
        start: function () {
            console.log("u started with someVar=" + someVar);
        }
    }
});

services.factory("websockets", function () {
    var listeners = [];
    var socket = null;
    return {
        start: function (url) {
            socket = new WebSocket(url);
            socket.onopen = function () {
            };
            socket.onclose = function () {
            };
            socket.onmessage = function (evt) {
                for (i = 0; i < listeners.length; ++i) {
                    listeners[i](evt);
                }
            }
        },
        stop: function () {
            socket.close();
        },
        addListener: function (t) {
            listeners.push(t);
        }
    }
});

var app = angular.module('app', ['services'])
    .run(function (websockets) {
        websockets.start("ws://localhost:8080/events");
    });

app.controller('controller', function ($scope, websockets, t, u) {
    $scope.msg = "...";

    websockets.addListener(function (evt) {
        var obj = JSON.parse(evt.data);
        $scope.$apply(function () {
            $scope.msg = obj.message
        });
    });

    t.start();
    u.start();
});