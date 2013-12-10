var uuids = angular.module('uuids', []);
uuids.factory("rfc4122", function () {
    return {
        newuuid: function () {
            // http://www.ietf.org/rfc/rfc4122.txt
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";
            return s.join("");
        }
    }
});

var services = angular.module('services', ['uuids']);
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
services.factory("websockets", function (rfc4122) {
    var listeners = {};
    var socket = null;
    return {
        start: function (url) {
            socket = new WebSocket(url);
            socket.onopen = function () {
            };
            socket.onclose = function () {
            };
            socket.onmessage = function (evt) {
                for (var listener in listeners) {
                    if (listeners.hasOwnProperty(listener)) {
                        listeners[listener](evt);
                    }
                }
            }
        },
        stop: function () {
            socket.close();
            listeners = {};
        },
        addListener: function (t) {
            var uuid = rfc4122.newuuid();
            listeners[uuid] = t;
            return uuid;
        },
        removeListener: function (uuid) {
            delete listeners[uuid];
        }
    }
});