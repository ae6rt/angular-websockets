angular.module('services', []).
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

app.controller('controller', function ($scope, websocket) {
    $scope.msg = "...";

    websocket.addListener(function (evt) {
        var obj = JSON.parse(evt.data);
        $scope.$apply(function () {
            $scope.msg = obj.message
        });
    });
});