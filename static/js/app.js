var app = angular.module('app', ['services'])
    .run(function (websockets) {
        websockets.start("ws://localhost:8080/events");
    });

app.controller('controller', function ($scope, websockets) {
    $scope.msg = "...";

    $scope.myUuid = websockets.addListener(function (evt) {
        var obj = JSON.parse(evt.data);
        $scope.$apply(function () {
            $scope.msg = obj.message
        });
    });
});