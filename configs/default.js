(function($){
    $.fn.configs = function(){
    };
    $.configs = {
        defaults: function(){
            $.configs.defaults = {
                "showOnReady": false,
                "alwaysShow": true,
                "threshold": 10,
                "interval": {
                    0: {
                        "limitChars": 5,
                        "bsClass": "#003d4c",
                        "message" : "Beaucoup trop court."
                    },
                    1: {
                        "limitChars": 10,
                        "bsClass": {
                            'color': 'red',
                            'background-color': 'black'
                        },
                        "message" : "Un peu mieux"
                    },
                    2: {
                        "limitChars": 11,
                        "bsClass": "info",
                        "message" : "Voilà, c'est la bonne longeur"
                    },
                    3: {
                        "limitChars": 18,
                        "bsClass": "default",
                        "message" : "Trop long"
                    },
                    
                },
                "previousClass": '',
                "defaultClass": 'warning',
                "limitReachedClass": 'danger label-important ',
                "separator": ' / ',
                "preText": '',
                "postText": '',
                "showMaxLength": true,
                "placement": 'bottom-right-inside',
                "message": null,
                "showCharsTyped": true,
                "utf8": false,
                "appendToParent": false,
                "twoCharLinebreak": true,
                "allowOverMax": false
            },
            $.configs.names = {
                "showOnReady": false,
                "alwaysShow": true,
                "threshold": 10,
                "interval": {
                    0: {
                        "limitChars": 5,
                        "bsClass": "success",
                        "message" : "Name success 5"
                    },
                    1: {
                        "limitChars": 10,
                        "bsClass": "info",
                        "message" : "Name info 10"
                    }
                    
                },
                "previousClass": '',
                "defaultClass": 'warning',
                "limitReachedClass": 'danger label-important ',
                "separator": ' / ',
                "preText": '',
                "postText": '',
                "showMaxLength": true,
                "placement": 'bottom-right-inside',
                "message": null,
                "showCharsTyped": true,
                "utf8": false,
                "appendToParent": false,
                "twoCharLinebreak": true,
                "allowOverMax": false
            }
        }
    };
    $.configs.defaults();
})(jQuery);