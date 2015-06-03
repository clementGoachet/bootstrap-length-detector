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

  module('interval option', {
    setup: function () {
     lengthDetectorInput = $('<input type="text" maxlength="50" alwaysShow=true data-interval-1="10 success Bonne longeur"/>')
        .appendTo('#qunit-fixture');

      lengthDetectorInput.lengthDetector();
    },
    teardown: function () {
      $('.length-detector').remove();
      $('#qunit-fixture').empty();
    }
  });

  test('Get interval limitChars', function () {
    lengthDetectorInput.focus();
    ok(lengthDetectorInput.interval[0].limitChars === 10, 'The limit chars is correctly set');
  });

  test('Get interval color', function () {
    lengthDetectorInput.focus();
    ok(lengthDetectorInput.interval[0].color === 'success', 'The color\'s interval is correctly set');
  });

  test('Get interval text', function () {
    lengthDetectorInput.focus();
    ok(lengthDetectorInput.interval[0].text === 'Bonne longeur', 'The text\'s interval is correctly set');
  });

  test('Change the class', function () {
    lengthDetectorInput.focus();
    lengthDetectorInput.val('Hi, color?');
    ok(lengthDetectorInput.hasClass('label-warning'), 'The class has changed');
  });

  test('Get second interval', function () {
    lengthDetectorInput.focus();
    lengthDetectorInput.blur().attr('data-interval-2', '49 warning trop long').focus();
    ok(!lengthDetectorInput.interval[1] == 'undefined', 'The second interval is correctly set');
  });

});
