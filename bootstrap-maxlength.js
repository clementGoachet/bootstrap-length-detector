(function ($) {
  'use strict';
  /**
   * We need an event when the elements are destroyed
   * because if an input is removed, we have to remove the
   * maxlength object associated (if any).
   * From:
   * http://stackoverflow.com/questions/2200494/jquery-trigger-event-when-an-element-is-removed-from-the-dom
   */
  if (!$.event.special.destroyed) {
    $.event.special.destroyed = {
      remove: function (o) {
        if (o.handler) {
          o.handler();
        }
      }
    };
  }


  $.fn.extend({
    lengthDetector: function (options, callback) {
        
      var documentBody = $('body');

      if ($.isFunction(options) && !callback) {
        callback = options;
        options = {};
      }
      var jsOptions = options;

      /**
       * Load params
       * 
       * @return JSON
       */
      function loadParams(inputLengthDetectorClass) {
        var defaults;

        if ($.configs) {

          if ($.type(inputLengthDetectorClass) === 'undefined') {
            defaults = $.configs.defaults;
          } else if ($.type(inputLengthDetectorClass) === 'string') {
            defaults = $.configs[inputLengthDetectorClass];
          }
        } else {
          $.error('jQuery.configs rules are not loaded, plz add configuration files to the page');
        }
        return defaults;
      }

      /**
       * get options from input limit to 10 interval
       * 
       * @return JSON
       */
      function getOptions(input) {

        var dataOptions = input.data();
        // Interval
        if ($.type(input.data('interval-1')) !== 'undefined'){

          var i = 1;
          var newIntervals = {};
          while (i < 10) {
            if ($.type(input.data('interval-'+i)) === 'undefined') {
              break;
            }
            var interval = input.data('interval-'+i).split(' ');
            newIntervals[i-1] = {};
            newIntervals[i-1].limitChars = interval[0];
            newIntervals[i-1].bsClass = interval[1];

            // Message
            interval.shift();
            interval.shift();
            newIntervals[i-1].message = interval.join(' ');

            i++;
          }
          dataOptions = $.extend(input.data(), newIntervals); 
        }
        // All others options             
        return dataOptions;
      }

      /**
      * Return the length of the specified input.
      *
      * @param input
      * @return {number}
      */
      function inputLength(input) {
        var text = input.val();

        if (options.twoCharLinebreak) {
          // Count all line breaks as 2 characters
          text = text.replace(/\r(?!\n)|\n(?!\r)/g, '\r\n');
        } else {
          // Remove all double-character (\r\n) linebreaks, so they're counted only once.
          text = text.replace(new RegExp('\r?\n', 'g'), '\n');
        }

        var currentLength = 0;

        if (options.utf8) {
          currentLength = utf8Length(text);
        } else {
          currentLength = text.length;
        }
        return currentLength;
      }

      /**
      * Truncate the text of the specified input.
      *
      * @param input
      * @param limit
      */
      function truncateChars(input, maxlength) {
        var text = input.val();
        var newlines = 0;

        if (options.twoCharLinebreak) {
          text = text.replace(/\r(?!\n)|\n(?!\r)/g, '\r\n');

          if (text.substr(text.length - 1) === '\n' && text.length % 2 === 1) {
            newlines = 1;
          }
        }

        input.val(text.substr(0, maxlength - newlines));
      }

      /**
      * Return the length of the specified input in UTF8 encoding.
      *
      * @param input
      * @return {number}
      */
      function utf8Length(string) {
        var utf8length = 0;
        for (var n = 0; n < string.length; n++) {
          var c = string.charCodeAt(n);
          if (c < 128) {
            utf8length++;
          }
          else if ((c > 127) && (c < 2048)) {
            utf8length = utf8length + 2;
          }
          else {
            utf8length = utf8length + 3;
          }
        }
        return utf8length;
      }

      /**
       * Return true if the indicator should be showing up.
       *
       * @param input
       * @param thereshold
       * @param maxlength
       * @return {number}
       */
      function charsLeftThreshold(input, thereshold, maxlength) {
        var output = true;
        if (!options.alwaysShow && (maxlength - inputLength(input) > thereshold)) {
          output = false;
        }
        return output;
      }

      /**
       * Returns how many chars are left to complete the fill up of the form.
       *
       * @param input
       * @param maxlength
       * @return {number}
       */
      function remainingChars(input, maxlength) {
        var length = maxlength - inputLength(input);
        return length;
      }

      /**
       * Set the style of the lengthDetectorIndicator background
       * It's possible to set the style of the div with styleOption = object
       * 
       * @param  mixed, (class, hexa)
       * @return String, the new class
       */
      function style(styleOption, maxLengthIndicator){
        var currentClass;

        // Style sheet
        if ($.type(styleOption) === 'object') {

          var styles = $.extend(maxLengthIndicator.attr('style'), styleOption);
          maxLengthIndicator.css(styles);
          currentClass = 'label';
        } else {
          // Reset the style
          maxLengthIndicator.removeAttr('style').css({
              display: 'none',
              position: 'absolute',
              whiteSpace: 'nowrap',
              zIndex: 1099
          });

          // Color hexa for background
          if (styleOption.search(/^#/) !== -1) {
            maxLengthIndicator.css('background-color', styleOption);
            currentClass = 'label';
          } 
          // Class
          else {
            maxLengthIndicator.css('background-color', '');
            currentClass = 'label label-'+styleOption;
          }
        }
       
        return currentClass;
      }

      /**
       * When called displays the indicator.
       *
       * @param indicator
       */
      function showRemaining(currentInput, indicator) {
        indicator.css({
          display: 'block'
        });
        currentInput.trigger('maxLength.shown');
      }

      /**
       * When called shows the indicator.
       *
       * @param indicator
       */
      function hideRemaining(currentInput, indicator) {
        indicator.css({
          display: 'none'
        });
        currentInput.trigger('maxlength.hidden');
      }

      /**
      * This function updates the value in the indicator
      *
      * @param maxLengthThisInput
      * @param typedChars
      * @return String
      */
      function updateMaxLengthHTML(currentInputText, maxLengthThisInput, typedChars, currentIntervalMessage) {
        var output = '';
        if (options.message) {
          if (typeof options.message === 'function') {
            output = options.message(currentInputText, maxLengthThisInput);
          } else {
            output = options.message.replace('%charsTyped%', typedChars)
              .replace('%charsRemaining%', maxLengthThisInput - typedChars)
              .replace('%charsTotal%', maxLengthThisInput);
          }
        } else {
          if (options.preText) {
            output += options.preText;
          }
          if (!options.showCharsTyped) {
            output += maxLengthThisInput - typedChars;
          }
          else {
            output += typedChars;
          }
          if (options.showMaxLength) {
            output += options.separator + maxLengthThisInput;
          }
          if (options.postText) {
            output += options.postText;
          }
        }
        if (isMessageEmpty(currentIntervalMessage)) {
          output += '. '+currentIntervalMessage;
        }
        return output;
      }

      /**
       * Get the interval where the currentLength is
       * 
       * @param  arrayInterval
       * @param  currentLength
       * @return array
       */
      function getCurrentInterval(arrayInterval, currentLength){
        var currentInterval = [];        

        var previousMinChars = 0;
        var nextMinChars;
        var finded = false; // used to get interval between index and index+1

        $.each(arrayInterval, function(key, value) {
         if (finded && currentLength <= value.limitChars){
            nextMinChars = value.limitChars;
            currentInterval = value;
            return false;
          } else {
            currentInterval = 'undefined';
          }
          if (currentLength > value.limitChars ) {
            
            previousMinChars = value.limitChars;
            finded = true;
          } 
        });

        // Initate Interval
        if (previousMinChars === 0) {
          $.each(arrayInterval,function(key ,value) {
            nextMinChars = value.limitChars;
            currentInterval = value;
            return false;
          });
        }
        return currentInterval;
      }

      /**
       * Order the options.interval with bubble sort
       * 
       * @param  Object, interval
       * @return Object, 
       */
      function sortInterval(interval){

        var n = Object.keys(interval).length;
        for (var i = n-1; i > 0; i--) {
          for (var j = 0; j < i; j++) {
            if (interval[j].limitChars > interval[j+1].limitChars) {

              var tmp = {};
              tmp = interval[j];
              interval[j] = interval[j+1];
              interval[j+1] = tmp;
            }
          }
        }
        return interval;
      }

      function isMessageEmpty(message){
        if ($.trim(message) === '') {
          return false;
        } else {
          return true;
        }
      }

      /**
       * This function updates the value of the counter in the indicator.
       * Wants as parameters: the number of remaining chars, the element currently managed,
       * the maxLength for the current input and the indicator generated for it.
       *
       * @param remaining
       * @param currentInput
       * @param maxLengthCurrentInput
       * @param maxLengthIndicator
       */
      function manageRemainingVisibility(remaining, currentInput, maxLengthCurrentInput, maxLengthIndicator) {
        if (maxLengthIndicator) {
          var interval = options.interval,
              currentLength = inputLength(currentInput),
              currentInterval = getCurrentInterval(interval,currentLength);

          maxLengthIndicator.html(updateMaxLengthHTML(currentInput.val(), maxLengthCurrentInput, (maxLengthCurrentInput - remaining), currentInterval.message));

          if (remaining > 0) {

            // Default
            if (currentInterval === 'undefined') {
              if (charsLeftThreshold(currentInput, options.threshold, maxLengthCurrentInput)) {
                var currentBsClass = style(options.defaultClass, maxLengthIndicator);
                showRemaining(currentInput, maxLengthIndicator.removeClass(options.previousClass).addClass(currentBsClass));
                options.previousClass = currentBsClass;
              } else {
                hideRemaining(currentInput, maxLengthIndicator);
              }
            } 
            // When interval is defined
            else {
              if (charsLeftThreshold(currentInput, options.threshold, maxLengthCurrentInput)) {
                var currentBsClass = style(currentInterval.bsClass, maxLengthIndicator);
                showRemaining(currentInput, maxLengthIndicator.removeClass(options.previousClass).addClass(currentBsClass));
                options.previousClass = currentBsClass;
              } else {
                hideRemaining(currentInput, maxLengthIndicator);
              }
            }
          }
          // Max length
          else {
            var currentBsClass = style(options.limitReachedClass, maxLengthIndicator);
            showRemaining(currentInput, maxLengthIndicator.removeClass(options.previousClass).addClass(currentBsClass));
            options.previousClass = currentBsClass;
          }
        }

        if (options.allowOverMax) {
          // class to use for form validation on custom maxlength attribute
          if (remaining < 0) {
            currentInput.addClass('overmax');
          } else {
            currentInput.removeClass('overmax');
          }
        }
      }

      /**
       * This function returns an object containing all the
       * informations about the position of the current input
       *
       * @param currentInput
       * @return object {bottom height left right top width}
       *
       */
      function getPosition(currentInput) {
        var el = currentInput[0];
        return $.extend({}, (typeof el.getBoundingClientRect === 'function') ? el.getBoundingClientRect() : {
          width: el.offsetWidth,
          height: el.offsetHeight
        }, currentInput.offset());
      }

      /**
       * This function places the maxLengthIndicator at the
       * top / bottom / left / right of the currentInput
       *
       * @param currentInput
       * @param maxLengthIndicator
       * @return null
       *
       */
      function place(currentInput, maxLengthIndicator) {
        var pos = getPosition(currentInput);

        // Supports custom placement handler
        if ($.type(options.placement) === 'function'){
          options.placement(currentInput, maxLengthIndicator, pos);
          return;
        }

        // Supports custom placement via css positional properties
        if ($.isPlainObject(options.placement)){
          placeWithCSS(options.placement, maxLengthIndicator);
          return;
        }

        var inputOuter = currentInput.outerWidth(),
          outerWidth = maxLengthIndicator.outerWidth(),
          actualWidth = maxLengthIndicator.width(),
          actualHeight = maxLengthIndicator.height();

        // get the right position if the indicator is appended to the input's parent
        if (options.appendToParent) {
          pos.top -= currentInput.parent().offset().top;
          pos.left -= currentInput.parent().offset().left;
        }

        switch (options.placement) {
          case 'bottom':
            maxLengthIndicator.css({ top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2 });
            break;
          case 'top':
            maxLengthIndicator.css({ top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 });
            break;
          case 'left':
            maxLengthIndicator.css({ top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth });
            break;
          case 'right':
            maxLengthIndicator.css({ top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width });
            break;
          case 'bottom-right':
            maxLengthIndicator.css({ top: pos.top + pos.height, left: pos.left + pos.width });
            break;
          case 'top-right':
            maxLengthIndicator.css({ top: pos.top - actualHeight, left: pos.left + inputOuter });
            break;
          case 'top-left':
            maxLengthIndicator.css({ top: pos.top - actualHeight, left: pos.left - outerWidth });
            break;
          case 'bottom-left':
            maxLengthIndicator.css({ top: pos.top + currentInput.outerHeight(), left: pos.left - outerWidth });
            break;
          case 'centered-right':
            maxLengthIndicator.css({ top: pos.top + (actualHeight / 2), left: pos.left + inputOuter - outerWidth - 3 });
            break;

            // Some more options for placements
          case 'bottom-right-inside':
            maxLengthIndicator.css({ top: pos.top + pos.height, left: pos.left + pos.width - outerWidth });
            break;
          case 'top-right-inside':
            maxLengthIndicator.css({ top: pos.top - actualHeight, left: pos.left + inputOuter - outerWidth });
            break;
          case 'top-left-inside':
            maxLengthIndicator.css({ top: pos.top - actualHeight, left: pos.left });
            break;
          case 'bottom-left-inside':
            maxLengthIndicator.css({ top: pos.top + currentInput.outerHeight(), left: pos.left });
            break;
        }
      }

      /**
       * This function places the maxLengthIndicator based on placement config object.
       *
       * @param {object} placement
       * @param {$} maxLengthIndicator
       * @return null
       *
       */
      function placeWithCSS(placement, maxLengthIndicator) {
        if (!placement || !maxLengthIndicator){
          return;
        }

        var POSITION_KEYS = [
          'top',
          'bottom',
          'left',
          'right',
          'position'
        ];

        var cssPos = {};

        // filter css properties to position
        $.each(POSITION_KEYS, function (i, key) {
          var val = options.placement[key];
          if (typeof val !== 'undefined'){
            cssPos[key] = val;
          }
        });

        maxLengthIndicator.css(cssPos);

        return;
      }

      /**
       * This function retrieves the maximum length of currentInput
       *
       * @param currentInput
       * @return {number}
       *
       */
      function getMaxLength(currentInput) {
        var attr = 'maxlength';
        if (options.allowOverMax) {
          attr = 'data-bs-mxl';
        }
        return currentInput.attr(attr) || currentInput.attr('size');
      }

      return this.each(function () {

        var currentInput = $(this),
          maxLengthCurrentInput,
          maxLengthIndicator;

        $(window).resize(function () {
          if (maxLengthIndicator) {
            place(currentInput, maxLengthIndicator);
          }
        });

        if (options.allowOverMax) {
          $(this).attr('data-bs-mxl', $(this).attr('maxlength'));
          $(this).removeAttr('maxlength');
        }

        function firstInit() {

          var configOptions = loadParams(currentInput.data('length-detector-class'));
          var dataOptions = getOptions(currentInput);
          options = $.extend({}, options, configOptions, dataOptions);  
          options = $.extend({}, options, jsOptions);

          var maxlengthContent = updateMaxLengthHTML(currentInput.val(), maxLengthCurrentInput, '0', '');
          maxLengthCurrentInput = getMaxLength(currentInput);

          sortInterval(options.interval);

          if (!maxLengthIndicator) {
            maxLengthIndicator = $('<span class="length-detector"></span>').css({
              display: 'none',
              position: 'absolute',
              whiteSpace: 'nowrap',
              zIndex: 1099
            }).html(maxlengthContent);
          }

          // We need to detect resizes if we are dealing with a textarea:
          if (currentInput.is('textarea')) {
            currentInput.data('maxlenghtsizex', currentInput.outerWidth());
            currentInput.data('maxlenghtsizey', currentInput.outerHeight());

            currentInput.mouseup(function () {
              if (currentInput.outerWidth() !== currentInput.data('maxlenghtsizex') || currentInput.outerHeight() !== currentInput.data('maxlenghtsizey')) {
                place(currentInput, maxLengthIndicator);
              }

              currentInput.data('maxlenghtsizex', currentInput.outerWidth());
              currentInput.data('maxlenghtsizey', currentInput.outerHeight());
            });
          }

          if (options.appendToParent) {
            currentInput.parent().append(maxLengthIndicator);
            currentInput.parent().css('position', 'relative');
          } else {
            documentBody.append(maxLengthIndicator);
          }

          var remaining = remainingChars(currentInput, getMaxLength(currentInput));
          manageRemainingVisibility(remaining, currentInput, maxLengthCurrentInput, maxLengthIndicator);
          place(currentInput, maxLengthIndicator);
        }

        if (options.showOnReady) {
          currentInput.ready(function () {
            firstInit();
          });
        } else {
          currentInput.focus(function () {
            firstInit();
          });
        }

        currentInput.on('maxLength.reposition', function () {
          place(currentInput, maxLengthIndicator);
        });


        currentInput.on('destroyed', function () {
          if (maxLengthIndicator) {
            maxLengthIndicator.remove();
          }
        });

        currentInput.on('blur', function () {
          if (maxLengthIndicator && !options.showOnReady) {
            maxLengthIndicator.remove();
          }
        });

        currentInput.on('input', function () {
          var maxlength = getMaxLength(currentInput),
            remaining = remainingChars(currentInput, maxlength),
            output = true;

          if (options.validate && remaining < 0) {
            truncateChars(currentInput, maxlength);
            output = false;
          } else {
            manageRemainingVisibility(remaining, currentInput, maxLengthCurrentInput, maxLengthIndicator);
          }

          place(currentInput, maxLengthIndicator);

          return output;
        });
      });
    }
  });
}(jQuery));