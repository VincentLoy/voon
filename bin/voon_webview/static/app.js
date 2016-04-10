/*globals XMLHttpRequest, window, Vue*/

(function () {
    'use strict';

    var //functions
        getQuery,
        dataGetQuery,
    // vars
        jsonData,
        app,
        request = new XMLHttpRequest();

    dataGetQuery = function () {
        var result = (window.location.search.match(new RegExp('[?&]data=([^&]+)')) || null);
        if (result) {
            return result[1];
        }
        return result;
    };

    request.open('GET', dataGetQuery(), true);
    request.onload = function () {
        var data;
        if (request.status >= 200 && request.status < 400) {
            // Success!
            data = JSON.parse(request.responseText);
            jsonData = data;
        } else {
            jsonData = false;
        }
    };
    request.onerror = function () {
        jsonData = false;
    };
    request.send();

    window.setTimeout(function () {
        console.log(jsonData);

        app = new Vue({
            el: '#voon-app',
            data: {
                message: 'salut les potes',
                data: jsonData,
                dataToRemove: []
            },
            computed: {
                command: function () {
                    return '$ voon cleanup [json-file-path] --ids ' + this.dataToRemove.join(' ');
                }
            },
            methods: {
                toggleRemove: function (voon_id) {
                    var index = this.dataToRemove.indexOf(voon_id);
                    if (index > -1) {
                        this.dataToRemove.splice(index, 1);
                    } else {
                        this.dataToRemove.push(voon_id);
                    }
                },
                voonIdInside: function (id) {
                    return this.dataToRemove.indexOf(id) > -1;
                }
            }
        });
    }, 0)
}());
