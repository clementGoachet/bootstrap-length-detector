$(function () {
  'use strict';

  var lengthDetectorInput;

  module('length-detector', {
    setup: function () {
      lengthDetectorInput = $('<input type="text" maxlength="10"/>')
        .appendTo('#qunit-fixture');

      lengthDetectorInput.lengthDetector();

    },
    teardown: function () {
      $('.length-detector').remove();
      $('#qunit-fixture').empty();
    }
  });

  test('Maxlength is displayed correctly', function () {
    lengthDetectorInput.focus();
    ok($('.length-detector').length, 'maxlength was inserted');
  });

  test('Maxlength is visible on focus', function () {
    lengthDetectorInput.focus();
    ok($('.length-detector').is(':visible'), 'Maxlength is visible');
  });

  test('Maxlength is removed on blur', function () {
    lengthDetectorInput.lengthDetector().focus().blur();
    ok(!$('.length-detector').length, 'Maxlength is removed on blur');
  });

  test('Maxlength updates the maxlength', function () {
    lengthDetectorInput.focus();

    // Change the maxlength attribute
    lengthDetectorInput.blur().attr('maxlength', '142').focus();
    ok($('.length-detector').html() === '0 / 142', 'Maxlength updated the field');

  });

  test('Removing an element with the maxlength removes the maxlength if any.', function () {
    lengthDetectorInput.lengthDetector().focus();
    lengthDetectorInput.remove();
    ok($('.length-detector').length === 0, 'Maxlength field removed with the input');

  });

  test('The focus event is triggered multiple times without a blur', function () {
    lengthDetectorInput.focus().focus().focus().focus();
    ok($('.length-detector').length === 1, 'Maxlength visualized only once after multiple focuses');
  });

  module('textarea', {
    setup: function () {
      lengthDetectorInput = $('<textarea maxlength="10"></textarea>')
        .appendTo('#qunit-fixture');

      lengthDetectorInput.lengthDetector();
    },
    teardown: function () {
      $('.length-detector').remove();
      $('#qunit-fixture').empty();
    }
  });

  test('Newlines are counted twice', function () {
    lengthDetectorInput.val('t\r\nt');
    lengthDetectorInput.lengthDetector();
    lengthDetectorInput.focus();

    ok($('.length-detector').html() === '4 / 10', 'Current length is: ' + $('.length-detector').html() + '. Expected 4 / 10.');
  });

  test('Message can be a customizable function', function () {
    $('.length-detector').remove();
    $('#qunit-fixture').empty();
    lengthDetectorInput = $('<input type="text" maxlength="10" />').appendTo('#qunit-fixture');
    lengthDetectorInput.lengthDetector({
      message: function (currentText, maxLength) {
        return '' + (currentText.length * 8) + ' Bytes / ' + (maxLength * 8) + ' Bytes';
      }
    });
    lengthDetectorInput.val('Test!');
    lengthDetectorInput.focus();

    ok($('.length-detector').html() === '40 Bytes / 80 Bytes', 'Message override is not functioning properly');
  });

  test('Message can be a customizable string', function () {
    $('.length-detector').remove();
    $('#qunit-fixture').empty();
    lengthDetectorInput = $('<input type="text" maxlength="10" />').appendTo('#qunit-fixture');
    lengthDetectorInput.lengthDetector({
      message: 'You have typed %charsTyped% chars, %charsRemaining% of %charsTotal% remaining'
    });
    lengthDetectorInput.val('Testing');
    lengthDetectorInput.focus();

    ok($('.length-detector').html() === 'You have typed 7 chars, 3 of 10 remaining', 'Message override is not functioning properly');
  });

  module('textarea', {
    setup: function () {
      lengthDetectorInput = $('<textarea maxlength="10"></textarea>')
        .appendTo('#qunit-fixture');

      lengthDetectorInput.lengthDetector({ twoCharLinebreak: false });
    },
    teardown: function () {
      $('.length-detector').remove();
      $('#qunit-fixture').empty();
    }
  });

  test('Newlines are not counted twice', function () {
    lengthDetectorInput.val('t\r\nt');

    lengthDetectorInput.lengthDetector({ twoCharLinebreak: false });
    lengthDetectorInput.focus();

    ok($('.length-detector').html() === '3 / 10', 'Current length is: ' + $('.length-detector').html() + '. Expected 3 / 10.');

  });

  module('overmax', {
    setup: function () {
      lengthDetectorInput = $('<input type="text" maxlength="10" />')
        .appendTo('#qunit-fixture');

      lengthDetectorInput.lengthDetector({ allowOverMax: true });
    },
    teardown: function () {
      $('.length-detector').remove();
      $('#qunit-fixture').empty();
    }
  });

  test('Allows over maxlength', function () {
    lengthDetectorInput.val('this is over the maxlength');
    lengthDetectorInput.focus();

    ok($('.length-detector').html() === '26 / 10', 'Current length is: ' + $('.length-detector').html() + '. Expected 26 / 10.');
  });

  test('Adds overmax class to element', function () {
    lengthDetectorInput.val('this is over the maxlength');
    lengthDetectorInput.focus();

    ok(lengthDetectorInput.hasClass('overmax'), '"overmax" class added to element');
  });

  test('Maxlength attribute removed', function () {
    lengthDetectorInput.val('this is over the maxlength');
    lengthDetectorInput.focus();

    ok(!lengthDetectorInput.is('[maxlength]'), 'Maxlength attribute is removed and does not exist.');
  });

  test('New data-bs-mxl attribute created', function () {
    lengthDetectorInput.val('this is over the maxlength');
    lengthDetectorInput.focus();

    ok(lengthDetectorInput.attr('data-bs-mxl') === '10', 'data-bs-mxl attribute value is ' + lengthDetectorInput.attr('data-bs-mxl') + '. Expected value of 10.');
  });


  module('placement object option', {
    setup: function () {
      lengthDetectorInput = $('<input type="text" maxlength="10" />')
          .appendTo('#qunit-fixture');

      lengthDetectorInput.lengthDetector({
        placement : {
          top: '5px',
          left: '6px',
          bottom: '7px',
          right: '10px'
        }
      });
    },
    teardown: function () {
      $('.length-detector').remove();
      $('#qunit-fixture').empty();
    }
  });

  test('css top placement from object placement option', function () {
    lengthDetectorInput.focus();
    var hasTop = $('.length-detector').attr('style').match(/top\:\s?5px/).length === 1;
    ok(hasTop, 'maxlength has expected top style');
  });

  test('css left placement from object placement option', function () {
    lengthDetectorInput.focus();
    var hasLeft = $('.length-detector').attr('style').match(/left\:\s?6px/).length === 1;
    ok(hasLeft, 'maxlength has expected left style');
  });

  test('css right placement from object placement option', function () {
    lengthDetectorInput.focus();
    var hasRight = $('.length-detector').attr('style').match(/right\:\s?10px/).length === 1;
    ok(hasRight, 'maxlength has expected right style');
  });

  test('css bottom placement from object placement option', function () {
    lengthDetectorInput.focus();
    var hasBottom = $('.length-detector').attr('style').match(/bottom\:\s?7px/).length === 1;
    ok(hasBottom, 'maxlength has expected bottom style');
  });

  var wasCalled,
      argsLength;

  module('placement function option', {
    setup: function () {
      wasCalled = false;
      lengthDetectorInput = $('<input type="text" maxlength="10" />')
          .appendTo('#qunit-fixture');

      lengthDetectorInput.lengthDetector({
        placement : function () {
          wasCalled = true;
          argsLength = arguments.length;
        }
      });
    },
    teardown: function () {
      $('.length-detector').remove();
      $('#qunit-fixture').empty();
    }
  });

  test('Was called', function () {
    lengthDetectorInput.focus();
    ok(wasCalled, 'Custom placement function was called');
  });
  test('Was called with expected number of arguments', function () {
    lengthDetectorInput.focus();
    ok(argsLength === 3, 'placement function option was called with expected number of arguments');
  });

/**
 * New features
 */
  module('interval option', {
    setup: function () {
      lengthDetectorInput = $('<input type="text" maxlength="10"/>')
        .appendTo('#qunit-fixture');

      lengthDetectorInput.lengthDetector({
        'interval': {
          0: {
              'limitChars': 8,
              'bsClass': 'info',
              'message' : 'The right length.' },
          1: {
              'limitChars': 5,
              'bsClass': 'success',
              'message' : 'Way too short.' }
        }});
    },
    teardown: function () {
      $('.length-detector').remove();
      $('#qunit-fixture').empty();
    }
  });

  test('Set interval class', function () {
    lengthDetectorInput.focus();
    ok($('.length-detector').hasClass('label-success'), 'The class\'s interval is correctly set');
  });

  test('Display interval message', function () {
    lengthDetectorInput.focus();
    ok($('.length-detector').html() === '0 / 10. Way too short.', 'The message\'s interval is correctly set');
  });

  test('Change the class to default', function () {

    lengthDetectorInput.val('Hi, color');
    lengthDetectorInput.focus();
    ok($('.length-detector').hasClass('label-warning'), 'The class has changed');
  });

  test('Get second interval', function () {
    lengthDetectorInput.val('Interval');
    lengthDetectorInput.focus();
    ok($('.length-detector').html() === '8 / 10. The right length.', 'The second interval is correctly set');
  });

  test('Get second interval', function () {
    lengthDetectorInput.val('Interval');
    lengthDetectorInput.focus();
    ok($('.length-detector').html() === '8 / 10. The right length.', 'The second interval is correctly set');
  });


  module('Setting options', {
    setup: function () {
      lengthDetectorInput = $('<input type="text" maxlength="10"/>')
        .appendTo('#qunit-fixture');

      lengthDetectorInput.lengthDetector();
    },
    teardown: function () {
      $('.length-detector').remove();
      $('#qunit-fixture').empty();
    }
  });

  test('Data options', function () {
    lengthDetectorInput.data('interval-1', '5 success Way too short.');
    lengthDetectorInput.focus();
    ok($('.length-detector').html() === '0 / 10. Way too short.', 'The data options is correctly set');
  });

  test('Config options', function () {
    lengthDetectorInput.data('length-detector-class', 'test');
    lengthDetectorInput.val('Hi, color');
    lengthDetectorInput.focus();
    ok($('.length-detector').html() === '9. Name info 10', 'The config options is correctly set');
  });

  test('Config not found', function () {
    lengthDetectorInput.data('length-detector-class', 'home');
    lengthDetectorInput.focus();
    ok($('.length-detector').html() === '0 / 10', 'The config "home" is not loaded');
  });

  test('Error data-interval ', function () {
    lengthDetectorInput.data('interval', '10 success Way too short.');
    lengthDetectorInput.val('Hi, color');
    lengthDetectorInput.focus();
    ok($('.length-detector').html() === '9 / 10', 'The interval is not set');
  });


  module('Setting js options', {
    setup: function () {
      lengthDetectorInput = $('<input type="text" maxlength="10"/>')
        .appendTo('#qunit-fixture');

      lengthDetectorInput.lengthDetector({
        'interval': {
            0: {
                'limitChars': 8,
                'bsClass': 'info',
                'message' : 'The right length.'
              },
            1: {
                'limitChars': 10,
            }
          }
      });
    },
    teardown: function () {
      $('.length-detector').remove();
      $('#qunit-fixture').empty();
    }
  });

  test('Js options', function () {
    lengthDetectorInput.val('Hi');
    lengthDetectorInput.focus();
    ok($('.length-detector').html() === '2 / 10. The right length.', 'Js options set correctly');
  });

  test('Error no style defined for an interval', function () {
    lengthDetectorInput.val('Hi, color');
    lengthDetectorInput.focus();
    ok($('.length-detector').hasClass('label-warning'), 'No style defined for the interval.');
  });

  test('All options set', function () {    
    lengthDetectorInput.data('interval-1', '5 warning Way too short.');
    lengthDetectorInput.data('length-detector-class', 'test');
    lengthDetectorInput.val('Interval');
    lengthDetectorInput.focus();
    ok($('.length-detector').html() === '8. The right length.', 'All options set correctly with the right priority order.');
  });

  module('Setting style', {
    setup: function () {
      lengthDetectorInput = $('<input type="text" maxlength="10"/>')
        .appendTo('#qunit-fixture');

      lengthDetectorInput.lengthDetector();
    },
    teardown: function () {
      $('.length-detector').remove();
      $('#qunit-fixture').empty();
    }
  });

  test('Hexa background color', function () {    
    lengthDetectorInput.data('interval-1', '5 #0540FE Way too short.');
    lengthDetectorInput.focus();
    ok($('.length-detector').css('background-color') === 'rgb(5, 64, 254)', 'The background-color is correctly set.');
  });

  test('Rgb background color', function () {    
    lengthDetectorInput.data('interval-1', '5 rgb(5, 64, 254) Way too short.');
    lengthDetectorInput.focus();
    ok($('.length-detector').css('background-color') === 'rgb(5, 64, 254)', 'The background-color is correctly set.');
  });

  test('Style sheet background color', function () {    
    lengthDetectorInput.data('interval-1', '5 {"color": "red"} Way too short.');
    lengthDetectorInput.focus();
    ok($('.length-detector').css('color') === 'rgb(255, 0, 0)', 'The background-color is correctly set.');
  });

});
