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

services.
    value('websocket', {
        socket: null,
        listeners: [],
        start: function (url) {
            this.socket = new WebSocket(url);
            this.socket.onopen = function () {
            };
            this.socket.onclose = function () {
            };
            this.socket.onmessage = (function (evt) {
                for (i = 0; i < this.listeners.length; ++i) {
                    this.listeners[i](evt);
                }
            }).bind(this);
        },
        stop: function () {
            this.socket.close();
        },
        addListener: function (listener) {
            this.listeners.push(listener);
        }
    });

var app = angular.module('app', ['services'])
    .run(function (websocket) {
        websocket.start("ws://localhost:8080/events");
    });

app.controller('controller', function ($scope, websocket, t, u) {
    $scope.msg = "...";

    websocket.addListener(function (evt) {
        var obj = JSON.parse(evt.data);
        $scope.$apply(function () {
            $scope.msg = obj.message
        });
    });

    t.start();
    u.start();
});