/*globals XMLHttpRequest, window, Vue*/

(function () {
    'use strict';

    var //functions
        getQuery,
        dataGetQuery,
    // vars
        SALES_RANK_LIMIT = {
            min: 50,
            medium: 500,
            max: 15000
        },
        jsonData,
        app,
        request = new XMLHttpRequest();

    dataGetQuery = function (q) {
        var result = (window.location.search.match(new RegExp('[?&]' + q + '=([^&]+)')) || null);
        if (result) {
            return result[1];
        }
        return result;
    };

    request.open('GET', dataGetQuery('data'), true);
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
                selectedImage: null,
                selectedImageIndex: 0,
                selectedItem: null,
                dataToRemove: [],
                salesRankLimit: SALES_RANK_LIMIT
            },
            computed: {
                command: function () {
                    return '$ voon cleanup ' + dataGetQuery('file') + ' --ids ' + this.dataToRemove.join(' ');
                },
                totalItems: function () {
                    return this.data.length;
                },
                totalItemsSlected: function () {
                    return this.dataToRemove.length;
                },
                remainingItems: function () {
                    return this.data.length - this.dataToRemove.length;
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
                addToRemove: function (voon_id) {
                    var index = this.dataToRemove.indexOf(voon_id);
                    if (index === -1) {
                        this.dataToRemove.push(voon_id);
                    }
                },
                cancelToRemove: function (voon_id) {
                    var index = this.dataToRemove.indexOf(voon_id);
                    if (index > -1) {
                        this.dataToRemove.splice(index, 1);
                    }
                },
                voonIdInside: function (id) {
                    return this.dataToRemove.indexOf(id) > -1;
                },
                selectItem: function (item) {
                    this.selectedItem = item;
                    this.selectedImage = this.selectedItem.images[0].large_image.url;
                },
                unselectItem: function (event) {
                    event.stopPropagation();
                    this.selectedItem = null;
                },
                selectImage: function (index) {
                    this.selectedImageIndex = index;
                    this.selectedImage = this.selectedItem.images[index].large_image.url;
                },
                selectBadSalesRank: function () {
                    var self = this;

                    self.data.forEach(function (item) {
                        console.log(item);
                        if (item.sales_rank >= SALES_RANK_LIMIT.max) {
                            self.addToRemove(item.voon_id);
                        }
                    });
                }
            }
        });
    }, 250);
}());
