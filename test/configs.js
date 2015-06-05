(function($){
    'use strict';
    $.fn.configs = function(){
    };
    $.configs = {
        defaults: function(){
            $.configs.defaults = {
                'showOnReady': false,
                'alwaysShow': false,
                'threshold': 10,
                'interval': '',
                'defaultClass': 'warning',
                'limitReachedClass': 'danger label-important',
                'separator': ' / ',
                'preText': '',
                'postText': '',
                'showMaxLength': true,
                'placement': 'bottom',
                'message': null,
                'showCharsTyped': true,
                'validate': false,
                'utf8': false,
                'appendToParent': false,
                'twoCharLinebreak': true,
                'allowOverMax': false,
                'previousClass': '',
            },
            $.configs.test = {
                'showOnReady': false,
                'alwaysShow': true,
                'threshold': 10,
                'interval': {
                    0: {
                        'limitChars': 5,
                        'bsClass': 'success',
                        'message' : 'Name success 5'
                    },
                    1: {
                        'limitChars': 10,
                        'bsClass': 'info',
                        'message' : 'Name info 10'
                    }                    
                },
                'previousClass': '',
                'defaultClass': 'warning',
                'limitReachedClass': 'danger label-important ',
                'separator': ' / ',
                'preText': '',
                'postText': '',
                'showMaxLength': false,
                'placement': 'bottom-right-inside',
                'message': null,
                'showCharsTyped': true,
                'utf8': false,
                'appendToParent': false,
                'twoCharLinebreak': true,
                'allowOverMax': false
            };
        }
    };
    $.configs.defaults();
})(jQuery);