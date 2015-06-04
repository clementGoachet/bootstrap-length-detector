(function($){
    $.fn.configs = function(){
    };
    $.configs = {
        defaults: function(){
            $.configs.defaults = {
                'showOnReady': false, // true to always show when indicator is ready
                'alwaysShow': false, // if true the indicator it's always shown.
                'threshold': 10, // Represents how many chars left are needed to show up the counter
                'interval': '',
                'defaultClass': 'warning',
                'limitReachedClass': 'danger label-important',
                'separator': ' / ',
                'preText': '',
                'postText': '',
                'showMaxLength': true,
                'placement': 'bottom',
                'message': null, // an alternative way to provide the message text
                'showCharsTyped': true, // show the number of characters typed and not the number of characters remaining
                'validate': false, // if the browser doesn't support the maxlength attribute, attempt to type more than
                // the indicated chars, will be prevented.
                'utf8': false, // counts using bytesize rather than length. eg: '£' is counted as 2 characters.
                'appendToParent': false, // append the indicator to the input field's parent instead of body
                'twoCharLinebreak': true,  // count linebreak as 2 characters to match IE/Chrome textarea validation. As well as DB storage.
                'allowOverMax': false,  // false = use maxlength attribute and browswer functionality.
                'previousClass': '',
            },
            $.configs.textarea = {
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
            $.configs.test = {
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
                "showMaxLength": false,
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