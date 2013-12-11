var app = angular.module('app', ['services'])
    .run(function (websockets) {
        websockets.start("ws://localhost:8080/events");
    });

app.controller('controller', function ($scope, websockets) {
    $scope.msg = "...";
    $scope.listening = true;

    $scope.start = function () {
        $scope.myUuid = websockets.addListener(function (evt) {
            var obj = JSON.parse(evt.data);
            $scope.$apply(function () {
                $scope.msg = obj.message
            });
        });
    };

    $scope.stop = function () {
        websockets.removeListener($scope.myUuid);
    };

    $scope.toggle = function () {
        if ($scope.listening) {
            $scope.stop();
        } else {
            $scope.start();
        }
        $scope.listening = !$scope.listening;
    };

    $scope.start();
});